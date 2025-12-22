const fs = require("fs");
const path = require("path");
const { DOMParser } = require("xmldom");

/**
 * Run PMD against an Apex file with a ruleset
 * @param {string} rulesetPath - Path to the PMD ruleset XML file
 * @param {string} apexFilePath - Path to the Apex file to test
 * @returns {Promise<Array>} Array of violations
 */
async function runPMD(rulesetPath, apexFilePath) {
  const { execSync } = require("child_process");

  try {
    const output = execSync(
      `pmd check --no-cache -d "${apexFilePath}" -R "${rulesetPath}" -f xml`,
      { encoding: "utf-8", timeout: 30000, stdio: ["pipe", "pipe", "ignore"] }
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
    if (error.code === "ENOENT" || error.message.includes("pmd")) {
      throw new Error("PMD CLI not available. Please install PMD to run tests.");
    }
    throw new Error(`Error running PMD: ${error.message}`);
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
    const doc = parser.parseFromString(pmdOutput, "text/xml");
    const violations = [];

    const fileNodes = doc.getElementsByTagName("file");
    for (let i = 0; i < fileNodes.length; i++) {
      const fileNode = fileNodes[i];
      const violationNodes = fileNode.getElementsByTagName("violation");

      for (let j = 0; j < violationNodes.length; j++) {
        const violationNode = violationNodes[j];
        violations.push({
          file: fileNode.getAttribute("name"),
          rule: violationNode.getAttribute("rule"),
          message: violationNode.getAttribute("message") || violationNode.textContent.trim(),
          line: parseInt(violationNode.getAttribute("beginline"), 10),
          column: parseInt(violationNode.getAttribute("begincol"), 10),
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
  const fixturePath = path.join(__dirname, "..", "fixtures", type, category, `${ruleName}.cls`);

  if (!fs.existsSync(fixturePath)) {
    throw new Error(`Fixture file not found: ${fixturePath}`);
  }

  return fs.readFileSync(fixturePath, "utf-8");
}

module.exports = {
  runPMD,
  parseViolations,
  assertViolation,
  assertNoViolations,
  readFixture,
};
