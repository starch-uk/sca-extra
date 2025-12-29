const fs = require('fs');
const path = require('path');
const os = require('os');
const { DOMParser } = require('@xmldom/xmldom');
const yaml = require('yaml');

/**
 * Run PMD CLI against an Apex file with a ruleset
 *
 * @param {string} rulesetPath - Path to the PMD ruleset XML file (relative to project root)
 * @param {string} apexFilePath - Path to the Apex file to test
 * @returns {Promise<Array>} Array of violations
 */
async function runPMDCLI(rulesetPath, apexFilePath) {
	const { execSync } = require('child_process');

	// Get absolute paths for better compatibility
	const absoluteApexPath = path.isAbsolute(apexFilePath)
		? apexFilePath
		: path.resolve(process.cwd(), apexFilePath);
	const absoluteRulesetPath = path.isAbsolute(rulesetPath)
		? rulesetPath
		: path.resolve(process.cwd(), rulesetPath);

	// Use a temporary file to avoid progressbar rendering conflicts with STDOUT
	const tempFile = path.join(
		os.tmpdir(),
		`pmd-output-${Date.now()}-${Math.random().toString(36).substring(7)}.xml`
	);

	try {
		// Use --no-cache to avoid cache issues
		// Output to file (-r) to avoid progressbar rendering conflicts with STDOUT
		// Ignore stderr to suppress warnings about progressbar and incremental analysis
		execSync(
			`pmd check --no-cache -d "${absoluteApexPath}" -R "${absoluteRulesetPath}" -f xml -r "${tempFile}"`,
			{
				encoding: 'utf-8',
				timeout: 30000,
				stdio: ['pipe', 'pipe', 'ignore'],
				cwd: process.cwd(),
			}
		);

		// Read the output file
		const output = fs.readFileSync(tempFile, 'utf-8');
		return parseViolations(output);
	} catch (error) {
		// PMD may exit with non-zero if violations found, but still output XML
		// Check if output file exists and contains XML
		if (fs.existsSync(tempFile)) {
			try {
				const output = fs.readFileSync(tempFile, 'utf-8');
				// Extract XML from output (may contain warnings before XML)
				const xmlMatch = output.match(/<\?xml[\s\S]*$/);
				if (xmlMatch) {
					return parseViolations(xmlMatch[0]);
				}
				return parseViolations(output);
			} catch {
				// If we can't read the file, fall through to throw the original error
			}
		}
		// PMD CLI is required - throw error if not available
		if (error.code === 'ENOENT') {
			throw new Error(
				'PMD CLI not available. Please install PMD to run tests. Visit: https://pmd.github.io/pmd/pmd_userdocs_installation.html'
			);
		}
		// If there's stderr, include it in the error message for debugging
		const stderr = error.stderr
			? `\nPMD stderr:\n${error.stderr.toString()}`
			: '';
		const stdout = error.stdout
			? `\nPMD stdout:\n${error.stdout.toString()}`
			: '';
		throw new Error(
			`Error running PMD CLI: ${error.message}${stderr}${stdout}`
		);
	} finally {
		// Clean up temporary file
		try {
			if (fs.existsSync(tempFile)) {
				fs.unlinkSync(tempFile);
			}
		} catch {
			// Ignore cleanup errors
		}
	}
}

/**
 * Run PMD against an Apex file with a ruleset
 *
 * @param {string} rulesetPath - Path to the PMD ruleset XML file (relative to project root)
 * @param {string} apexFilePath - Path to the Apex file to test
 * @returns {Promise<Array>} Array of violations
 */
async function runPMD(rulesetPath, apexFilePath) {
	return runPMDCLI(rulesetPath, apexFilePath);
}

/**
 * Parse PMD XML output into violation objects
 * @param {string} xmlOutput - XML output from PMD
 * @returns {Array} Array of violation objects
 */
function parseViolations(xmlOutput) {
	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(xmlOutput, 'text/xml');
		const violations = [];

		// PMD format (<pmd><file><violation>)
		const fileNodes = doc.getElementsByTagName('file');
		for (let i = 0; i < fileNodes.length; i++) {
			const fileNode = fileNodes[i];
			const violationNodes = fileNode.getElementsByTagName('violation');

			for (let j = 0; j < violationNodes.length; j++) {
				const violationNode = violationNodes[j];
				violations.push({
					file: fileNode.getAttribute('name'),
					rule: violationNode.getAttribute('rule'),
					message:
						violationNode.getAttribute('message') ||
						violationNode.textContent.trim(),
					line: parseInt(violationNode.getAttribute('beginline'), 10),
					column: parseInt(
						violationNode.getAttribute('begincol'),
						10
					),
				});
			}
		}

		return violations;
	} catch (error) {
		throw new Error(`Error parsing XML output: ${error.message}`);
	}
}

/**
 * Assert that a specific violation exists
 * @param {Array} violations - Array of violations
 * @param {string} ruleName - Name of the rule
 * @param {number} lineNumber - Expected line number
 */
function assertViolation(violations, ruleName, lineNumber) {
	const violation = violations.find(
		(v) => v.rule === ruleName && v.line === lineNumber
	);

	if (!violation) {
		throw new Error(
			`Expected violation of rule "${ruleName}" at line ${lineNumber}, but found: ${JSON.stringify(violations)}`
		);
	}
}

/**
 * Assert that no violations exist for a rule
 * @param {Array} violations - Array of violations
 * @param {string} ruleName - Name of the rule
 */
function assertNoViolations(violations, ruleName) {
	const ruleViolations = violations.filter((v) => v.rule === ruleName);
	if (ruleViolations.length > 0) {
		throw new Error(
			`Expected no violations of rule "${ruleName}", but found: ${JSON.stringify(ruleViolations)}`
		);
	}
}

/**
 * Read an Apex test fixture file
 * @param {string} category - Rule category
 * @param {string} ruleName - Rule name
 * @param {string} type - 'positive' or 'negative'
 * @returns {string} File contents
 */
function readFixture(category, ruleName, type) {
	const fixturePath = path.join(
		__dirname,
		'..',
		'fixtures',
		type,
		category,
		`${ruleName}.cls`
	);

	if (!fs.existsSync(fixturePath)) {
		throw new Error(`Fixture file not found: ${fixturePath}`);
	}

	return fs.readFileSync(fixturePath, 'utf-8');
}

/**
 * Load regex rules from code-analyzer.yml
 * @returns {Object} Object mapping rule names to rule configurations
 */
function loadRegexRulesFromConfig() {
	const configPath = path.resolve(process.cwd(), 'code-analyzer.yml');
	if (!fs.existsSync(configPath)) {
		throw new Error(
			`code-analyzer.yml not found at ${configPath}. Make sure you're running from the project root.`
		);
	}

	const configContent = fs.readFileSync(configPath, 'utf-8');
	const config = yaml.parse(configContent);

	return config?.engines?.regex?.custom_rules || {};
}

/**
 * Get regex rule configuration by name from code-analyzer.yml
 * @param {string} ruleName - Name of the rule
 * @returns {Object|null} Rule configuration or null if not found
 */
function getRegexRuleConfig(ruleName) {
	const rules = loadRegexRulesFromConfig();
	return rules[ruleName] || null;
}

/**
 * Run a Regex rule against an Apex file
 * @param {string|Object} regexPatternOrRuleName - Regular expression pattern (with flags) or rule name to load from code-analyzer.yml
 * @param {string} apexFilePath - Path to the Apex file to test
 * @param {string} ruleName - Name of the rule (required if first param is a regex pattern)
 * @param {string} violationMessage - Message to show for violations (optional if loading from config)
 * @returns {Promise<Array>} Array of violations
 */
async function runRegexRule(
	regexPatternOrRuleName,
	apexFilePath,
	ruleName,
	violationMessage
) {
	let regexPattern;
	let actualRuleName;
	let actualViolationMessage;

	// Check if first parameter is a rule name (string without / at start) or a regex pattern
	if (
		typeof regexPatternOrRuleName === 'string' &&
		!regexPatternOrRuleName.startsWith('/')
	) {
		// First parameter is a rule name - load from config
		actualRuleName = regexPatternOrRuleName;
		const ruleConfig = getRegexRuleConfig(actualRuleName);
		if (!ruleConfig) {
			throw new Error(
				`Regex rule "${actualRuleName}" not found in code-analyzer.yml`
			);
		}
		regexPattern = ruleConfig.regex;
		actualViolationMessage =
			ruleConfig.violation_message || ruleConfig.description;
	} else {
		// First parameter is a regex pattern - use provided values (backward compatibility)
		regexPattern = regexPatternOrRuleName;
		actualRuleName = ruleName;
		actualViolationMessage = violationMessage;
	}

	if (!actualRuleName) {
		throw new Error(
			'Rule name is required when providing a regex pattern directly'
		);
	}
	const fileContent = fs.readFileSync(apexFilePath, 'utf-8');
	const violations = [];

	// Parse regex pattern (format: /pattern/flags)
	// Use [\s\S] instead of . to match newlines, and make it non-greedy
	const regexMatch = regexPattern.match(/^\/([\s\S]+?)\/([gimsuvy]*)$/);
	if (!regexMatch) {
		throw new Error(
			`Invalid regex pattern format: ${regexPattern}. Expected format: /pattern/flags`
		);
	}

	const pattern = regexMatch[1];
	const flags = regexMatch[2] || '';
	const regex = new RegExp(pattern, flags);

	// Find all matches
	let match;
	let lastIndex = 0;

	// Reset regex lastIndex for global matches
	if (flags.includes('g')) {
		regex.lastIndex = 0;
	}

	while ((match = regex.exec(fileContent)) !== null) {
		// Calculate line number from match index
		const matchIndex = match.index;
		const textBeforeMatch = fileContent.substring(0, matchIndex);
		const lineNumber = textBeforeMatch.split('\n').length;
		const lastNewlineIndex = textBeforeMatch.lastIndexOf('\n');
		const column =
			lastNewlineIndex === -1
				? matchIndex + 1
				: matchIndex - lastNewlineIndex;

		// Avoid infinite loop with zero-length matches
		if (match[0].length === 0) {
			if (regex.lastIndex === lastIndex) {
				regex.lastIndex++;
			}
			lastIndex = regex.lastIndex;
			continue;
		}

		violations.push({
			file: apexFilePath,
			rule: actualRuleName,
			message:
				actualViolationMessage ||
				`Match found for rule ${actualRuleName}`,
			line: lineNumber,
			column: column,
		});

		// If not global, break after first match
		if (!flags.includes('g')) {
			break;
		}

		// Avoid infinite loop
		if (regex.lastIndex === lastIndex) {
			regex.lastIndex++;
		}
		lastIndex = regex.lastIndex;
	}

	return violations;
}

module.exports = {
	runPMD,
	parseViolations,
	assertViolation,
	assertNoViolations,
	readFixture,
	runRegexRule,
	loadRegexRulesFromConfig,
	getRegexRuleConfig,
};
