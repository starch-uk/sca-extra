#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Check for performance regressions in benchmark results
 */
function checkPerformanceRegressions(resultsPath) {
	if (!fs.existsSync(resultsPath)) {
		console.error(`❌ Results file not found: ${resultsPath}`);
		process.exit(1);
	}

	const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
	const baselinePath = path.join(
		__dirname,
		'..',
		'benchmarks',
		'results',
		'baseline.json'
	);

	if (!fs.existsSync(baselinePath)) {
		console.log(
			'⚠️  No baseline found. Run benchmark with --baseline first.'
		);
		return;
	}

	const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));
	const threshold = 10; // 10% threshold
	const regressions = [];

	results.rules.forEach((rule) => {
		const baselineRule = baseline.rules.find((r) => r.name === rule.name);
		if (baselineRule) {
			const percentChange =
				((rule.executionTime - baselineRule.executionTime) /
					baselineRule.executionTime) *
				100;
			if (percentChange > threshold) {
				regressions.push({
					rule: rule.name,
					baselineTime: baselineRule.executionTime,
					currentTime: rule.executionTime,
					percentChange: Math.round(percentChange * 100) / 100,
				});
			}
		}
	});

	if (regressions.length > 0) {
		console.log('❌ Performance Regressions Detected:\n');
		regressions.forEach((regression) => {
			console.log(
				`  - ${regression.rule}: ${regression.percentChange}% slower`
			);
			console.log(
				`    Baseline: ${regression.baselineTime}ms, Current: ${regression.currentTime}ms\n`
			);
		});
		process.exit(1);
	} else {
		console.log('✅ No performance regressions detected');
	}
}

// Run check
if (require.main === module) {
	const resultsPath = process.argv[2] || 'benchmark-results.json';
	checkPerformanceRegressions(resultsPath);
}

module.exports = { checkPerformanceRegressions };
