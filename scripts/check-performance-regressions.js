#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Check for performance regressions in benchmark results
 */
function checkPerformanceRegressions(resultsPath) {
	const rootDir = path.join(__dirname, '..');

	// Validate input path to prevent path traversal attacks
	if (!resultsPath || typeof resultsPath !== 'string') {
		console.error(`❌ Invalid results path: ${resultsPath}`);
		process.exit(1);
	}

	// Reject paths containing path traversal sequences or absolute paths
	if (resultsPath.includes('..') || path.isAbsolute(resultsPath)) {
		console.error(
			`❌ Invalid results path (contains path traversal or is absolute): ${resultsPath}`
		);
		process.exit(1);
	}

	// Normalize and resolve the path
	const normalizedPath = path.normalize(resultsPath);
	const safeResultsPath = path.resolve(rootDir, normalizedPath);

	// Ensure the resolved results path is within the repository root
	// Use path.relative to check containment more reliably
	const relativePath = path.relative(rootDir, safeResultsPath);
	if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
		console.error(
			`❌ Invalid results path (outside project root): ${resultsPath}`
		);
		process.exit(1);
	}

	if (!fs.existsSync(safeResultsPath)) {
		console.error(`❌ Results file not found: ${resultsPath}`);
		process.exit(1);
	}

	const results = JSON.parse(fs.readFileSync(safeResultsPath, 'utf-8'));
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
