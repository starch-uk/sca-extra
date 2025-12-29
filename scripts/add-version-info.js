#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

/**
 * Add version information to all rule descriptions
 */
function addVersionInfo() {
	const rulesetsDir = path.join(__dirname, '..', 'rulesets');
	const categories = fs
		.readdirSync(rulesetsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	let updatedCount = 0;

	categories.forEach((category) => {
		const categoryPath = path.join(rulesetsDir, category);
		const files = fs
			.readdirSync(categoryPath)
			.filter((file) => file.endsWith('.xml'));

		files.forEach((file) => {
			const filePath = path.join(categoryPath, file);
			if (updateRuleFile(filePath)) {
				updatedCount++;
			}
		});
	});

	console.log(
		`✅ Updated ${updatedCount} rule files with version information`
	);
}

/**
 * Update a single rule XML file to add version information
 */
function updateRuleFile(filePath) {
	const content = fs.readFileSync(filePath, 'utf-8');

	try {
		// Check if version info already exists
		if (content.includes('Version:')) {
			return false;
		}

		const parser = new DOMParser();
		const doc = parser.parseFromString(content, 'text/xml');

		// Check for parsing errors
		const parseErrors = doc.getElementsByTagName('parsererror');
		if (parseErrors.length > 0) {
			console.error(`Error parsing ${filePath}: XML parsing error`);
			return false;
		}

		// Find all rules
		const rules = doc.getElementsByTagName('rule');
		let updated = false;

		for (let i = 0; i < rules.length; i++) {
			const rule = rules[i];
			const descriptions = rule.getElementsByTagName('description');

			for (let j = 0; j < descriptions.length; j++) {
				const description = descriptions[j];
				const descriptionText = description.textContent || '';

				// Check if version info already exists
				if (descriptionText.includes('Version:')) {
					continue;
				}

				// Use standard indentation (3 tabs) to match description content
				// This matches the indentation used in all rule files
				const indent = '\t\t\t';

				// Trim trailing whitespace and add version info
				const trimmedText = descriptionText.trim();
				const versionLine = `\n\n${indent}Version: 1.0.0`;
				const newText = trimmedText + versionLine;

				// Update the description text content
				description.textContent = newText;
				updated = true;
			}
		}

		if (updated) {
			const serializer = new XMLSerializer();
			const newContent = serializer.serializeToString(doc);
			// Preserve XML declaration formatting
			const xmlDecl = content.match(/^<\?xml[^>]*\?>/);
			const finalContent = xmlDecl
				? xmlDecl[0] +
					'\n' +
					newContent.replace(/^<\?xml[^>]*\?>\s*/, '')
				: newContent;
			fs.writeFileSync(filePath, finalContent, 'utf-8');
			return true;
		}

		return false;
	} catch (error) {
		console.error(`Error processing ${filePath}: ${error.message}`);
		return false;
	}
}

// Run script
if (require.main === module) {
	addVersionInfo();
}

module.exports = { addVersionInfo, updateRuleFile };
