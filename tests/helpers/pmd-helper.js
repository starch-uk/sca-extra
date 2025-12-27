const fs = require('fs');
const path = require('path');
const { DOMParser } = require('xmldom');

/**
 * Run PMD against an Apex file with a ruleset
 * @param {string} rulesetPath - Path to the PMD ruleset XML file
 * @param {string} apexFilePath - Path to the Apex file to test
 * @returns {Promise<Array>} Array of violations
 */
async function runPMD(rulesetPath, apexFilePath) {
	const { execSync } = require('child_process');

	try {
		const output = execSync(
			`pmd check --no-cache -d "${apexFilePath}" -R "${rulesetPath}" -f xml`,
			{ encoding: 'utf-8', timeout: 30000, stdio: ['pipe', 'pipe', 'ignore'] }
		);
		// Extract XML from output (may contain warnings before XML)
		const xmlMatch = output.match(/<\?xml[\s\S]*$/);
		if (xmlMatch) {
			return parseViolations(xmlMatch[0]);
		}
		return parseViolations(output);
	} catch (error) {
		// PMD may exit with non-zero if violations found, but still output XML
		if (error.stdout) {
			// Extract XML from stdout (may contain warnings before XML)
			const xmlMatch = error.stdout.match(/<\?xml[\s\S]*$/);
			if (xmlMatch) {
				return parseViolations(xmlMatch[0]);
			}
			return parseViolations(error.stdout);
		}
		// PMD CLI is required - throw error if not available
		if (error.code === 'ENOENT') {
			throw new Error('PMD CLI not available. Please install PMD 7+ to run tests.');
		}
		// Surface stderr if available to help diagnose XPath / ruleset issues
		const stderr = error.stderr ? `\nPMD stderr:\n${error.stderr}` : '';
		throw new Error(`Error running PMD: ${error.message}${stderr}`);
	}
}

/**
 * Parse PMD XML output into violation objects
 * @param {string} pmdOutput - XML output from PMD
 * @returns {Array} Array of violation objects
 */
function parseViolations(pmdOutput) {
	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(pmdOutput, 'text/xml');
		const violations = [];

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
						violationNode.getAttribute('message') || violationNode.textContent.trim(),
					line: parseInt(violationNode.getAttribute('beginline'), 10),
					column: parseInt(violationNode.getAttribute('begincol'), 10),
				});
			}
		}

		return violations;
	} catch (error) {
		throw new Error(`Error parsing PMD output: ${error.message}`);
	}
}

/**
 * Assert that a specific violation exists
 * @param {Array} violations - Array of violations
 * @param {string} ruleName - Name of the rule
 * @param {number} lineNumber - Expected line number
 */
function assertViolation(violations, ruleName, lineNumber) {
	const violation = violations.find((v) => v.rule === ruleName && v.line === lineNumber);

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
	const fixturePath = path.join(__dirname, '..', 'fixtures', type, category, `${ruleName}.cls`);

	if (!fs.existsSync(fixturePath)) {
		throw new Error(`Fixture file not found: ${fixturePath}`);
	}

	return fs.readFileSync(fixturePath, 'utf-8');
}

/**
 * Run a Regex rule against an Apex file
 * @param {string} regexPattern - Regular expression pattern (with flags)
 * @param {string} apexFilePath - Path to the Apex file to test
 * @param {string} ruleName - Name of the rule
 * @param {string} violationMessage - Message to show for violations
 * @returns {Promise<Array>} Array of violations
 */
async function runRegexRule(regexPattern, apexFilePath, ruleName, violationMessage) {
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
		const column = lastNewlineIndex === -1 ? matchIndex + 1 : matchIndex - lastNewlineIndex;

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
			rule: ruleName,
			message: violationMessage || `Match found for rule ${ruleName}`,
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
};
