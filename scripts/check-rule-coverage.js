#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

/**
 * Check test coverage for XML rule files and regex rules from code-analyzer.yml
 * Reports which rules have tests and which don't
 * Also checks XPath coverage for XML rules
 */
function checkRuleCoverage() {
	const rulesetsDir = path.join(__dirname, '..', 'rulesets');
	const testsDir = path.join(__dirname, '..', 'tests', 'unit');
	const codeAnalyzerPath = path.join(__dirname, '..', 'code-analyzer.yml');

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

	// Check coverage
	const covered = [];
	const uncovered = [];

	ruleFiles.forEach((rule) => {
		if (testedRules.has(rule.ruleName)) {
			covered.push(rule);
		} else {
			uncovered.push(rule);
		}
	});

	// Report results
	console.log('\n📊 Rule Test Coverage Report\n');
	console.log(`Total Rules: ${ruleFiles.length}`);
	console.log(
		`Covered: ${covered.length} (${((covered.length / ruleFiles.length) * 100).toFixed(1)}%)`
	);
	console.log(
		`Uncovered: ${uncovered.length} (${((uncovered.length / ruleFiles.length) * 100).toFixed(1)}%)\n`
	);

	if (uncovered.length > 0) {
		console.log('❌ Rules without tests:');
		uncovered.forEach((rule) => {
			console.log(`  - ${rule.category}/${rule.file}`);
		});
		console.log('');
	}

	if (covered.length > 0) {
		console.log('✅ Rules with tests:');
		covered.forEach((rule) => {
			console.log(`  - ${rule.category}/${rule.file}`);
		});
		console.log('');
	}

	// Check XPath coverage for XML rules
	console.log('\n🔍 Checking XPath coverage for XML rules...\n');
	const { checkXPathCoverage } = require('./check-xpath-coverage');
	const xpathExitCode = checkXPathCoverage();

	// Generate lcov file
	const { generateLcov } = require('./generate-lcov');
	generateLcov();

	// Exit with error if there are uncovered rules or XPath coverage issues
	if (uncovered.length > 0) {
		process.exit(1);
	} else if (xpathExitCode !== 0) {
		process.exit(xpathExitCode);
	} else {
		console.log('\n✅ All rules have test coverage!');
	}
}

// Run coverage check
if (require.main === module) {
	checkRuleCoverage();
}

module.exports = { checkRuleCoverage };
