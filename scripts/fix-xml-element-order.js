#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { DOMParser, XMLSerializer } = require('xmldom');

/**
 * Fix element order in PMD ruleset XML files to match XSD schema
 * Correct order: description, priority, properties, exclude, example
 */
function fixElementOrder() {
	const rulesetsDir = path.join(__dirname, '..', 'rulesets');
	const categories = fs
		.readdirSync(rulesetsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	let fixedCount = 0;

	categories.forEach((category) => {
		const categoryPath = path.join(rulesetsDir, category);
		const files = fs.readdirSync(categoryPath).filter((file) => file.endsWith('.xml'));

		files.forEach((file) => {
			const filePath = path.join(categoryPath, file);
			if (fixRuleFile(filePath)) {
				fixedCount++;
				console.log(`Fixed: ${filePath}`);
			}
		});
	});

	console.log(`\n✅ Fixed ${fixedCount} file(s)`);
}

/**
 * Fix element order in a single rule XML file
 */
function fixRuleFile(filePath) {
	const content = fs.readFileSync(filePath, 'utf-8');

	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(content, 'text/xml');

		// Check for parsing errors
		const parseErrors = doc.getElementsByTagName('parsererror');
		if (parseErrors.length > 0) {
			console.error(`Error parsing ${filePath}: XML parsing error`);
			return false;
		}

		const rules = doc.getElementsByTagName('rule');
		let changed = false;

		// Process each rule
		for (let i = 0; i < rules.length; i++) {
			const rule = rules[i];
			const childNodes = Array.from(rule.childNodes);

			// Extract elements by tag name
			const description = childNodes.find(
				(node) =>
					node.nodeType === 1 &&
					(node.localName === 'description' || node.nodeName === 'description')
			);
			const priority = childNodes.find(
				(node) =>
					node.nodeType === 1 &&
					(node.localName === 'priority' || node.nodeName === 'priority')
			);
			const properties = childNodes.find(
				(node) =>
					node.nodeType === 1 &&
					(node.localName === 'properties' || node.nodeName === 'properties')
			);
			const excludes = childNodes.filter(
				(node) =>
					node.nodeType === 1 &&
					(node.localName === 'exclude' || node.nodeName === 'exclude')
			);
			const examples = childNodes.filter(
				(node) =>
					node.nodeType === 1 &&
					(node.localName === 'example' || node.nodeName === 'example')
			);

			// Get current order of element nodes (excluding text nodes)
			const elementNodes = childNodes.filter((node) => node.nodeType === 1);
			const currentOrder = elementNodes
				.filter((node) =>
					['description', 'priority', 'properties', 'exclude', 'example'].includes(
						node.localName || node.nodeName
					)
				)
				.map((node) => node.localName || node.nodeName);

			// Build expected order
			const expectedOrder = [];
			if (description) expectedOrder.push('description');
			if (priority) expectedOrder.push('priority');
			if (properties) expectedOrder.push('properties');
			excludes.forEach(() => expectedOrder.push('exclude'));
			examples.forEach(() => expectedOrder.push('example'));

			// Check if reordering is needed
			const needsReorder =
				currentOrder.length !== expectedOrder.length ||
				currentOrder.some((name, idx) => name !== expectedOrder[idx]);

			if (needsReorder) {
				// Collect all elements we want to reorder
				const elementsToReorder = [];
				if (description) elementsToReorder.push(description);
				if (priority) elementsToReorder.push(priority);
				if (properties) elementsToReorder.push(properties);
				excludes.forEach((ex) => elementsToReorder.push(ex));
				examples.forEach((ex) => elementsToReorder.push(ex));

				// Collect other elements that should stay
				const otherElements = elementNodes.filter(
					(node) =>
						!['description', 'priority', 'properties', 'exclude', 'example'].includes(
							node.localName || node.nodeName
						)
				);

				// Clone all elements before removing them (to preserve all content)
				const clonedElements = elementsToReorder.map((element) => element.cloneNode(true));
				const clonedOtherElements = otherElements.map((element) => element.cloneNode(true));

				// Remove all element nodes from the rule
				const allElementsToRemove = [...elementsToReorder, ...otherElements];
				allElementsToRemove.forEach((element) => {
					if (element.parentNode === rule) {
						rule.removeChild(element);
					}
				});

				// Re-add elements in correct order using cloned nodes
				// First, add any non-target elements back
				clonedOtherElements.forEach((element) => {
					rule.appendChild(element);
				});

				// Then add target elements in correct order
				clonedElements.forEach((element) => {
					rule.appendChild(element);
				});

				changed = true;
			}
		}

		if (changed) {
			const serializer = new XMLSerializer();
			const newContent = serializer.serializeToString(doc);
			// Preserve XML declaration
			const xmlDecl = content.match(/^<\?xml[^>]*\?>/);
			const finalContent = xmlDecl
				? xmlDecl[0] + '\n' + newContent.replace(/^<\?xml[^>]*\?>\s*/, '')
				: newContent;
			fs.writeFileSync(filePath, finalContent, 'utf-8');
			return true;
		}
	} catch (error) {
		console.error(`Error fixing ${filePath}: ${error.message}`);
		return false;
	}

	return false;
}

// Run fix
if (require.main === module) {
	fixElementOrder();
}

module.exports = { fixElementOrder, fixRuleFile };
