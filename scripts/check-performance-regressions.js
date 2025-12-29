#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sanitizeFilename = require('sanitize-filename');

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

	// Reject absolute paths
	if (path.isAbsolute(resultsPath)) {
		console.error(
			`❌ Invalid results path (absolute paths not allowed): ${resultsPath}`
		);
		process.exit(1);
	}

	// Sanitize the path by sanitizing each segment
	// This eliminates dangerous characters and prevents path traversal attacks
	const pathSegments = resultsPath.split(path.sep);
	const sanitizedSegments = pathSegments.map((segment) =>
		sanitizeFilename(segment)
	);
	const sanitizedPath = sanitizedSegments.join(path.sep);

	// Reject if sanitization changed the path (indicates dangerous characters)
	if (sanitizedPath !== resultsPath) {
		console.error(
			`❌ Invalid results path (contains unsafe characters): ${resultsPath}`
		);
		process.exit(1);
	}

	// Normalize and resolve the path relative to root directory
	// This prevents path traversal attacks by resolving any remaining ".." segments
	const resolvedPath = path.resolve(rootDir, sanitizedPath);

	// Resolve symbolic links in root directory to get canonical root path
	const realRootDir = fs.realpathSync(rootDir);

	// Validate that the resolved path is within the root directory before proceeding
	// This provides defense in depth against path traversal attacks
	if (
		!resolvedPath.startsWith(rootDir + path.sep) &&
		resolvedPath !== rootDir
	) {
		console.error(
			`❌ Invalid results path (outside project root): ${resultsPath}`
		);
		process.exit(1);
	}

	// Resolve symbolic links in the file path and ensure it's within root directory
	// This prevents path traversal attacks and follows CodeQL security recommendations
	let realResultsPath;
	try {
		realResultsPath = fs.realpathSync(resolvedPath);
	} catch {
		// File doesn't exist, but we still need to validate the path structure
		// Check that the resolved path would be within the canonical root directory
		if (
			!resolvedPath.startsWith(realRootDir + path.sep) &&
			resolvedPath !== realRootDir
		) {
			console.error(
				`❌ Invalid results path (outside project root): ${resultsPath}`
			);
			process.exit(1);
		}
		console.error(`❌ Results file not found: ${resultsPath}`);
		process.exit(1);
	}

	// Ensure the resolved path is within the canonical root directory
	if (
		!realResultsPath.startsWith(realRootDir + path.sep) &&
		realResultsPath !== realRootDir
	) {
		console.error(
			`❌ Invalid results path (outside project root): ${resultsPath}`
		);
		process.exit(1);
	}

	const results = JSON.parse(fs.readFileSync(realResultsPath, 'utf-8'));
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
