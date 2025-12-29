#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { DOMParser } = require('@xmldom/xmldom');

/**
 * Check element order in all PMD ruleset XML files
 */
function checkElementOrder() {
	const rulesetsDir = path.join(__dirname, '..', 'rulesets');
	const categories = fs
		.readdirSync(rulesetsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	const wrongOrder = [];

	categories.forEach((category) => {
		const categoryPath = path.join(rulesetsDir, category);
		const files = fs
			.readdirSync(categoryPath)
			.filter((file) => file.endsWith('.xml'));

		files.forEach((file) => {
			const filePath = path.join(categoryPath, file);
			const result = checkRuleFile(filePath);
			if (result.wrongOrder) {
				wrongOrder.push({
					file: filePath,
					order: result.order,
					expectedOrder: result.expectedOrder,
				});
			}
		});
	});

	if (wrongOrder.length > 0) {
		console.log('\n❌ Files with incorrect element order:');
		wrongOrder.forEach(({ file, order, expectedOrder }) => {
			console.log(`  ${file}`);
			console.log(`    Current:  [${order.join(', ')}]`);
			console.log(`    Expected: [${expectedOrder.join(', ')}]`);
		});
		return false;
	} else {
		console.log('✅ All files have correct element order!');
		return true;
	}
}

/**
 * Check element order in a single rule XML file
 */
function checkRuleFile(filePath) {
	const content = fs.readFileSync(filePath, 'utf-8');

	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(content, 'text/xml');

		// Check for parsing errors
		const parseErrors = doc.getElementsByTagName('parsererror');
		if (parseErrors.length > 0) {
			console.error(`Error parsing ${filePath}: XML parsing error`);
			return { wrongOrder: false };
		}

		const rules = doc.getElementsByTagName('rule');
		const results = [];

		// Process each rule
		for (let i = 0; i < rules.length; i++) {
			const rule = rules[i];
			const childNodes = Array.from(rule.childNodes);

			// Get element nodes in order
			const elementNodes = childNodes.filter(
				(node) => node.nodeType === 1
			);
			const currentOrder = elementNodes
				.filter((node) =>
					[
						'description',
						'priority',
						'properties',
						'exclude',
						'example',
					].includes(node.localName || node.nodeName)
				)
				.map((node) => node.localName || node.nodeName);

			// Extract elements to build expected order
			const description = elementNodes.find(
				(node) =>
					node.localName === 'description' ||
					node.nodeName === 'description'
			);
			const priority = elementNodes.find(
				(node) =>
					node.localName === 'priority' ||
					node.nodeName === 'priority'
			);
			const properties = elementNodes.find(
				(node) =>
					node.localName === 'properties' ||
					node.nodeName === 'properties'
			);
			const excludes = elementNodes.filter(
				(node) =>
					node.localName === 'exclude' || node.nodeName === 'exclude'
			);
			const examples = elementNodes.filter(
				(node) =>
					node.localName === 'example' || node.nodeName === 'example'
			);

			// Build expected order
			const expectedOrder = [];
			if (description) expectedOrder.push('description');
			if (priority) expectedOrder.push('priority');
			if (properties) expectedOrder.push('properties');
			excludes.forEach(() => expectedOrder.push('exclude'));
			examples.forEach(() => expectedOrder.push('example'));

			const wrongOrder =
				JSON.stringify(currentOrder) !== JSON.stringify(expectedOrder);

			if (wrongOrder) {
				results.push({
					wrongOrder: true,
					order: currentOrder,
					expectedOrder,
				});
			}
		}

		if (results.length > 0) {
			return results[0]; // Return first wrong order found
		}
	} catch (error) {
		console.error(`Error checking ${filePath}: ${error.message}`);
		return { wrongOrder: false };
	}

	return { wrongOrder: false };
}

// Run check
if (require.main === module) {
	const success = checkElementOrder();
	process.exit(success ? 0 : 1);
}

module.exports = { checkElementOrder, checkRuleFile };
