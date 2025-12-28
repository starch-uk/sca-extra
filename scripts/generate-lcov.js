#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const { extractXPath } = require('./check-xpath-coverage');

/**
 * Generate lcov coverage file from rule coverage data
 */
function generateLcov() {
	const rulesetsDir = path.join(__dirname, '..', 'rulesets');
	const testsDir = path.join(__dirname, '..', 'tests', 'unit');
	const codeAnalyzerPath = path.join(__dirname, '..', 'code-analyzer.yml');
	const coverageDir = path.join(__dirname, '..', 'coverage');

	// Ensure coverage directory exists
	if (!fs.existsSync(coverageDir)) {
		fs.mkdirSync(coverageDir, { recursive: true });
	}

	const lcovPath = path.join(coverageDir, 'lcov.info');
	const lines = [];

	// Header
	lines.push('TN:');
	lines.push('');

	// Get all XML rule files
	const ruleFiles = [];
	const categories = fs
		.readdirSync(rulesetsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	categories.forEach((category) => {
		const categoryPath = path.join(rulesetsDir, category);
		const files = fs
			.readdirSync(categoryPath)
			.filter((file) => file.endsWith('.xml'))
			.map((file) => ({
				type: 'xml',
				category,
				file,
				ruleName: path.basename(file, '.xml'),
				path: path.join(categoryPath, file),
			}));
		ruleFiles.push(...files);
	});

	// Get regex rules from code-analyzer.yml
	if (fs.existsSync(codeAnalyzerPath)) {
		const codeAnalyzerContent = fs.readFileSync(codeAnalyzerPath, 'utf-8');
		const codeAnalyzer = yaml.parse(codeAnalyzerContent);
		if (
			codeAnalyzer.engines &&
			codeAnalyzer.engines.regex &&
			codeAnalyzer.engines.regex.custom_rules
		) {
			const regexRules = Object.keys(
				codeAnalyzer.engines.regex.custom_rules
			);
			regexRules.forEach((ruleName) => {
				ruleFiles.push({
					type: 'regex',
					category: 'regex',
					file: `${ruleName} (from code-analyzer.yml)`,
					ruleName,
					path: codeAnalyzerPath,
				});
			});
		}
	}

	// Get all test files
	const testFiles = fs
		.readdirSync(testsDir)
		.filter((file) => file.endsWith('.test.js'))
		.map((file) => path.join(testsDir, file));

	// Read all test files and extract rule names
	const testedRules = new Set();
	testFiles.forEach((testFile) => {
		const content = fs.readFileSync(testFile, 'utf-8');
		// Match patterns like 'rulesets/category/RuleName.xml' for XML rules
		const xmlRuleMatches = content.matchAll(
			/rulesets\/[\w-]+\/([\w]+)\.xml/g
		);
		for (const match of xmlRuleMatches) {
			const ruleName = match[1];
			if (ruleName) {
				testedRules.add(ruleName);
			}
		}
		// Match patterns like describe('RuleName', ...) for regex rules
		const regexRuleMatches = content.matchAll(/describe\(['"]([\w]+)['"]/g);
		for (const match of regexRuleMatches) {
			const ruleName = match[1];
			if (ruleName) {
				testedRules.add(ruleName);
			}
		}
	});

	// Generate lcov entries for each rule file
	ruleFiles.forEach((rule) => {
		const isCovered = testedRules.has(rule.ruleName);
		const absolutePath = path.resolve(rule.path);
		const relativePath = path.relative(
			path.join(__dirname, '..'),
			absolutePath
		);

		// For XML rules, count XPath lines
		let totalLines = 1;
		let coveredLines = isCovered ? 1 : 0;

		if (rule.type === 'xml') {
			const xpath = extractXPath(rule.path);
			if (xpath) {
				// Count non-empty lines in XPath
				const xpathLines = xpath
					.split('\n')
					.filter((line) => line.trim());
				totalLines = Math.max(1, xpathLines.length);
				coveredLines = isCovered ? totalLines : 0;
			}
		}

		// SF: Source file
		lines.push(`SF:${relativePath}`);

		// FN: Function name (we'll use the rule name)
		lines.push(`FN:1,${rule.ruleName}`);
		lines.push(`FNF:1`);
		lines.push(`FNH:${isCovered ? 1 : 0}`);
		if (isCovered) {
			lines.push(`FNDA:1,${rule.ruleName}`);
		}

		// DA: Line data (coverage for each line)
		// We'll report coverage for the first line (the rule itself)
		for (let i = 1; i <= totalLines; i++) {
			if (isCovered) {
				lines.push(`DA:${i},1`);
			} else {
				lines.push(`DA:${i},0`);
			}
		}

		// LF: Lines found, LH: Lines hit
		lines.push(`LF:${totalLines}`);
		lines.push(`LH:${coveredLines}`);
		lines.push('end_of_record');
		lines.push('');
	});

	// Write lcov file
	fs.writeFileSync(lcovPath, lines.join('\n'), 'utf-8');
	console.log(`\n✅ Generated lcov file: ${lcovPath}`);
	console.log(`   Total rules: ${ruleFiles.length}`);
	console.log(`   Covered: ${Array.from(testedRules).length}`);
	console.log(
		`   Coverage: ${((Array.from(testedRules).length / ruleFiles.length) * 100).toFixed(1)}%\n`
	);

	return lcovPath;
}

// Run if called directly
if (require.main === module) {
	generateLcov();
}

module.exports = { generateLcov };
