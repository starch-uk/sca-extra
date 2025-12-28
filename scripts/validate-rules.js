#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { DOMParser } = require('xmldom');

/**
 * Validate all PMD ruleset XML files
 */
function validateRules() {
	const rulesetsDir = path.join(__dirname, '..', 'rulesets');
	const categories = fs
		.readdirSync(rulesetsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	let errors = [];
	let warnings = [];

	categories.forEach((category) => {
		const categoryPath = path.join(rulesetsDir, category);
		const files = fs
			.readdirSync(categoryPath)
			.filter((file) => file.endsWith('.xml'));

		files.forEach((file) => {
			const filePath = path.join(categoryPath, file);
			const result = validateRuleFile(filePath);
			errors = errors.concat(result.errors);
			warnings = warnings.concat(result.warnings);
		});
	});

	// Print results
	if (warnings.length > 0) {
		console.log('\n⚠️  Warnings:');
		warnings.forEach((warning) => console.log(`  - ${warning}`));
	}

	if (errors.length > 0) {
		console.log('\n❌ Errors:');
		errors.forEach((error) => console.log(`  - ${error}`));
		process.exit(1);
	}

	if (errors.length === 0 && warnings.length === 0) {
		console.log('✅ All rules validated successfully!');
	}
}

/**
 * Validate a single rule XML file
 */
function validateRuleFile(filePath) {
	const errors = [];
	const warnings = [];
	const content = fs.readFileSync(filePath, 'utf-8');

	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(content, 'text/xml');

		// Check for parsing errors
		const parseErrors = doc.getElementsByTagName('parsererror');
		if (parseErrors.length > 0) {
			errors.push(`${filePath}: XML parsing error`);
			return { errors, warnings };
		}

		// Validate ruleset structure
		const rulesets = doc.getElementsByTagName('ruleset');
		if (rulesets.length === 0) {
			errors.push(`${filePath}: No ruleset element found`);
			return { errors, warnings };
		}

		// Validate rules
		const rules = doc.getElementsByTagName('rule');
		if (rules.length === 0) {
			warnings.push(`${filePath}: No rules found in ruleset`);
		}

		for (let i = 0; i < rules.length; i++) {
			const rule = rules[i];
			const ruleName = rule.getAttribute('name');
			const rulePath = `${filePath} (rule: ${ruleName})`;

			// Check required attributes
			if (!ruleName) {
				errors.push(`${rulePath}: Missing 'name' attribute`);
			}
			if (!rule.getAttribute('language')) {
				errors.push(`${rulePath}: Missing 'language' attribute`);
			}
			if (!rule.getAttribute('message')) {
				warnings.push(`${rulePath}: Missing 'message' attribute`);
			}
			if (
				rule.getAttribute('class') !==
				'net.sourceforge.pmd.lang.rule.xpath.XPathRule'
			) {
				errors.push(`${rulePath}: Must use XPathRule class`);
			}

			// Check for XPath property
			const properties = rule.getElementsByTagName('properties')[0];
			if (!properties) {
				errors.push(`${rulePath}: Missing 'properties' element`);
				continue;
			}

			const xpathProperty = Array.from(
				properties.getElementsByTagName('property')
			).find((prop) => prop.getAttribute('name') === 'xpath');

			if (!xpathProperty) {
				errors.push(`${rulePath}: Missing 'xpath' property`);
			} else {
				const xpathValue =
					xpathProperty.getElementsByTagName('value')[0];
				if (!xpathValue || !xpathValue.textContent.trim()) {
					errors.push(`${rulePath}: XPath property has no value`);
				}
			}

			// Check for description
			const description = rule.getElementsByTagName('description')[0];
			if (!description || !description.textContent.trim()) {
				warnings.push(`${rulePath}: Missing or empty description`);
			}

			// Check for version in description
			if (description && !description.textContent.includes('Version:')) {
				warnings.push(
					`${rulePath}: Description should include version information`
				);
			}
		}
	} catch (error) {
		errors.push(`${filePath}: ${error.message}`);
	}

	return { errors, warnings };
}

// Run validation
if (require.main === module) {
	validateRules();
}

module.exports = { validateRules, validateRuleFile };
