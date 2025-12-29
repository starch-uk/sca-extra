#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Run tests and identify which rules have failing tests
 * @returns {Set<string>} Set of rule names with failing tests
 */
function getRulesWithFailingTests() {
	const rulesWithFailingTests = new Set();

	try {
		// Run tests with JSON output (Jest returns non-zero on failures, so catch the error)
		let testOutput = '';
		try {
			testOutput = execSync('pnpm test --json', {
				encoding: 'utf-8',
				stdio: ['pipe', 'pipe', 'pipe'],
				cwd: path.join(__dirname, '..'),
			});
		} catch (error) {
			// Jest returns non-zero exit code on test failures, but stdout contains JSON
			testOutput = error.stdout || error.stderr || '';
		}

		// Try to parse JSON output
		try {
			// Find JSON in output (might have other text before/after)
			const jsonMatch = testOutput.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				return rulesWithFailingTests;
			}

			const testResults = JSON.parse(jsonMatch[0]);

			// Parse test failures to identify rule names
			if (testResults.testResults) {
				testResults.testResults.forEach((result) => {
					if (result.assertionResults) {
						result.assertionResults.forEach((assertion) => {
							if (assertion.status === 'failed') {
								// Extract rule name from test file path
								const testFile = result.name;

								// Try to extract rule name from describe blocks in test file
								try {
									const testFileContent = fs.readFileSync(
										testFile,
										'utf-8'
									);
									// Find the describe block that contains this test
									const lines = testFileContent.split('\n');
									const describeStack = [];
									let foundTest = false;

									for (let i = 0; i < lines.length; i++) {
										const line = lines[i];
										// Look for describe blocks
										const describeMatch = line.match(
											/describe\(['"]([^'"]+)['"]/
										);
										if (describeMatch) {
											const describeName =
												describeMatch[1];
											// Skip top-level describe blocks (like "Code Style Rules", "Design Rules")
											if (
												!describeName.endsWith(
													'Rules'
												) &&
												!describeName.includes(' - ')
											) {
												describeStack.push(
													describeName
												);
											}
										}
										// Check if this line contains the failing test
										if (
											assertion.title &&
											(line.includes(
												`it('${assertion.title}'`
											) ||
												line.includes(
													`it("${assertion.title}"`
												))
										) {
											foundTest = true;
											// Use the most nested describe (rule name)
											if (describeStack.length > 0) {
												const ruleName =
													describeStack[
														describeStack.length - 1
													];
												rulesWithFailingTests.add(
													ruleName
												);
											}
											break;
										}
										// Track closing braces to pop describe stack
										if (
											line.trim() === '});' &&
											describeStack.length > 0
										) {
											describeStack.pop();
										}
									}

									// If we couldn't find the specific test, use the last describe block
									if (
										!foundTest &&
										describeStack.length > 0
									) {
										const ruleName =
											describeStack[
												describeStack.length - 1
											];
										rulesWithFailingTests.add(ruleName);
									}
								} catch {
									// If we can't read the file, skip it
								}
							}
						});
					}
				});
			}
		} catch {
			// If JSON parsing fails, try to extract rule names from error output
			const combinedOutput = testOutput;
			// Look for rule names in error messages or test paths
			const ruleMatches = combinedOutput.matchAll(
				/rulesets\/([^/]+)\/([^/]+)\.xml/g
			);
			for (const match of ruleMatches) {
				const ruleName = match[2];
				rulesWithFailingTests.add(ruleName);
			}
		}
	} catch (error) {
		// If we can't run tests at all, we'll continue without this check
		console.warn(`⚠️  Could not run tests: ${error.message}`);
	}

	return rulesWithFailingTests;
}

/**
 * Get rules with failing existing tests (tests that existed at HEAD)
 * @param {Set<string>} rulesWithFailingTests - Rules that have failing tests
 * @returns {Set<string>} Rules with failing tests that existed at HEAD
 */
function getRulesWithFailingExistingTests(rulesWithFailingTests) {
	const rulesWithFailingExistingTests = new Set();

	if (rulesWithFailingTests.size === 0) {
		return rulesWithFailingExistingTests;
	}

	// Get all test files from HEAD
	let existingTestFiles = [];
	try {
		const testFiles = execSync('git ls-tree -r --name-only HEAD tests/', {
			encoding: 'utf-8',
		})
			.split('\n')
			.filter(Boolean);

		existingTestFiles = testFiles.filter(
			(file) => file.endsWith('.js') || file.endsWith('.cls')
		);
	} catch (err) {
		console.warn(`⚠️  Could not get test files from HEAD: ${err.message}`);
		return rulesWithFailingExistingTests;
	}

	// For each rule with failing tests, check if any of its test files existed at HEAD
	rulesWithFailingTests.forEach((ruleName) => {
		// Check test fixture files (both positive and negative)
		const fixtureFiles = existingTestFiles.filter(
			(file) =>
				(file.includes(`/${ruleName}.cls`) ||
					file.includes(`/${ruleName}_`)) &&
				file.endsWith('.cls')
		);

		// Check test JS files - look for rule name in test file content
		// Test files are organized by category, so we need to check the content
		const testJsFiles = existingTestFiles.filter((file) =>
			file.endsWith('.test.js')
		);

		let foundInTestFile = false;
		for (const testFile of testJsFiles) {
			try {
				// Check if this test file contains tests for this rule
				const testFileContent = execSync(`git show HEAD:${testFile}`, {
					encoding: 'utf-8',
				});
				// Look for describe block with this rule name
				if (
					testFileContent.includes(`describe('${ruleName}'`) ||
					testFileContent.includes(`describe("${ruleName}"`)
				) {
					foundInTestFile = true;
					break;
				}
			} catch {
				// If we can't read from git, try reading from filesystem
				try {
					const testFileContent = fs.readFileSync(
						path.join(__dirname, '..', testFile),
						'utf-8'
					);
					if (
						testFileContent.includes(`describe('${ruleName}'`) ||
						testFileContent.includes(`describe("${ruleName}"`)
					) {
						foundInTestFile = true;
						break;
					}
				} catch {
					// Skip if we can't read
				}
			}
		}

		// If any test files for this rule existed at HEAD, mark it
		if (fixtureFiles.length > 0 || foundInTestFile) {
			rulesWithFailingExistingTests.add(ruleName);
		}
	});

	return rulesWithFailingExistingTests;
}

/**
 * Bump version numbers in rule XML files
 * - Major bump for rules with failing existing tests
 * - Minor bump for rules with new tests
 * - Patch bump for other changed rules
 */
function bumpRuleVersions() {
	console.log('Running tests to check for failures...');
	const rulesWithFailingTests = getRulesWithFailingTests();
	const rulesWithFailingExistingTests = getRulesWithFailingExistingTests(
		rulesWithFailingTests
	);

	// Get list of changed rule files
	const changedRules = execSync('git diff --name-only HEAD', {
		encoding: 'utf-8',
	})
		.split('\n')
		.filter((line) => line.includes('rulesets/') && line.endsWith('.xml'))
		.map((line) => path.join(__dirname, '..', line.trim()));

	// Get list of new/modified test files
	const testFiles = execSync('git status --short', { encoding: 'utf-8' })
		.split('\n')
		.filter(
			(line) =>
				line.includes('tests/') &&
				(line.startsWith('??') || line.startsWith(' M'))
		)
		.map((line) => {
			const match = line.match(/tests\/.*\/(.*?)(_|\.)/);
			return match ? match[1] : null;
		})
		.filter(Boolean);

	// Get list of all rule names to validate against
	const allRuleNames = new Set();
	changedRules.forEach((rulePath) => {
		const ruleName = path.basename(rulePath, '.xml');
		allRuleNames.add(ruleName);
	});

	// Determine which rules have new tests
	const rulesWithNewTests = new Set();
	testFiles.forEach((testFile) => {
		// Extract rule name from test file (e.g., PreferSwitchOverIfElseChains_Instanceof -> PreferSwitchOverIfElseChains)
		const ruleName = testFile.replace(/_.*$/, '');
		// Only add if it's an actual rule name
		if (allRuleNames.has(ruleName)) {
			rulesWithNewTests.add(ruleName);
		}
	});

	console.log(
		'Rules with failing existing tests (major bump):',
		Array.from(rulesWithFailingExistingTests)
	);
	console.log(
		'Rules with new tests (minor bump):',
		Array.from(rulesWithNewTests)
	);
	console.log(
		'Other changed rules (patch bump):',
		changedRules.length -
			rulesWithFailingExistingTests.size -
			rulesWithNewTests.size
	);

	let majorBumped = 0;
	let minorBumped = 0;
	let patchBumped = 0;

	changedRules.forEach((rulePath) => {
		if (!fs.existsSync(rulePath)) {
			return;
		}

		const content = fs.readFileSync(rulePath, 'utf-8');
		const ruleName = path.basename(rulePath, '.xml');

		// Extract current version
		const versionMatch = content.match(/Version:\s*(\d+)\.(\d+)\.(\d+)/);
		if (!versionMatch) {
			console.warn(`⚠️  No version found in ${rulePath}`);
			return;
		}

		// Check version at HEAD to see if it's already been bumped
		let headVersion = null;
		let headVersionNumbers = null;
		try {
			const relativePath = path.relative(
				path.join(__dirname, '..'),
				rulePath
			);
			const headContent = execSync(`git show HEAD:${relativePath}`, {
				encoding: 'utf-8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});
			const headVersionMatch = headContent.match(
				/Version:\s*(\d+)\.(\d+)\.(\d+)/
			);
			if (headVersionMatch) {
				headVersion = headVersionMatch[0];
				headVersionNumbers = {
					major: parseInt(headVersionMatch[1], 10),
					minor: parseInt(headVersionMatch[2], 10),
					patch: parseInt(headVersionMatch[3], 10),
				};
			}
		} catch {
			// File might not exist at HEAD (new file), or git command failed
			// In this case, we'll proceed with bumping
		}

		// Check if this rule has failing existing tests (highest priority - major bump)
		const hasFailingExistingTests =
			rulesWithFailingExistingTests.has(ruleName);
		// Check if this rule has new tests (second priority - minor bump)
		const hasNewTests = rulesWithNewTests.has(ruleName);

		// Determine what the version should be based on change type
		let targetMajor = headVersionNumbers
			? headVersionNumbers.major
			: parseInt(versionMatch[1], 10);
		let targetMinor = headVersionNumbers
			? headVersionNumbers.minor
			: parseInt(versionMatch[2], 10);
		let targetPatch = headVersionNumbers
			? headVersionNumbers.patch
			: parseInt(versionMatch[3], 10);

		// Calculate target version based on change type (priority: major > minor > patch)
		let bumpType = 'patch';
		if (hasFailingExistingTests) {
			targetMajor++;
			targetMinor = 0;
			targetPatch = 0;
			bumpType = 'major';
		} else if (hasNewTests) {
			targetMinor++;
			targetPatch = 0;
			bumpType = 'minor';
		} else {
			targetPatch++;
			bumpType = 'patch';
		}

		const targetVersion = `${targetMajor}.${targetMinor}.${targetPatch}`;
		const currentVersion = `${parseInt(versionMatch[1], 10)}.${parseInt(versionMatch[2], 10)}.${parseInt(versionMatch[3], 10)}`;

		// If version has already changed since HEAD, check if it needs fixing
		if (headVersion && versionMatch[0] !== headVersion) {
			// If current version matches target, it's already correctly bumped
			if (currentVersion === targetVersion) {
				console.log(
					`⏭️  ${ruleName}: Version already correctly bumped from ${headVersion} to Version: ${targetVersion}, skipping`
				);
				return;
			}

			// Version has been bumped incorrectly (multiple times or wrong type)
			// Fix it to the correct target version
			const oldVersion = versionMatch[0];
			const newVersionLine = `Version: ${targetVersion}`;
			const newContent = content.replace(oldVersion, newVersionLine);
			fs.writeFileSync(rulePath, newContent, 'utf-8');

			console.log(
				`🔧 ${ruleName}: Fixed version from ${oldVersion} to ${newVersionLine} (${bumpType})`
			);

			// Update counters
			if (bumpType === 'major') {
				majorBumped++;
			} else if (bumpType === 'minor') {
				minorBumped++;
			} else {
				patchBumped++;
			}
			return;
		}

		// Version hasn't been bumped yet, proceed with normal bump
		const newVersion = targetVersion;
		const oldVersion = versionMatch[0];
		const newVersionLine = `Version: ${newVersion}`;

		// Replace version in content
		const newContent = content.replace(oldVersion, newVersionLine);

		fs.writeFileSync(rulePath, newContent, 'utf-8');

		// Update counters
		if (bumpType === 'major') {
			majorBumped++;
		} else if (bumpType === 'minor') {
			minorBumped++;
		} else {
			patchBumped++;
		}

		console.log(
			`✅ ${ruleName}: ${versionMatch[0]} -> ${newVersionLine} (${bumpType})`
		);
	});

	console.log(`\n✅ Version bump complete:`);
	console.log(`   - Major bumps: ${majorBumped}`);
	console.log(`   - Minor bumps: ${minorBumped}`);
	console.log(`   - Patch bumps: ${patchBumped}`);
}

// Run script
if (require.main === module) {
	bumpRuleVersions();
}

module.exports = { bumpRuleVersions };
