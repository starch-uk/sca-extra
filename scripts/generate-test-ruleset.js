#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { DOMParser, XMLSerializer } = require('xmldom');

/**
 * Generate a combined test ruleset from all individual rulesets
 */
function generateTestRuleset() {
	const rulesetsDir = path.join(__dirname, '..', 'rulesets');
	const outputPath = path.join(
		__dirname,
		'..',
		'tests',
		'rulesets',
		'test-ruleset.xml'
	);
	const categories = fs
		.readdirSync(rulesetsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	// Create combined ruleset structure
	const combinedRuleset = {
		name: 'Combined Test Ruleset',
		description: 'Combined ruleset for testing all rules',
		rules: [],
	};

	// Collect all rules from all categories
	categories.forEach((category) => {
		const categoryPath = path.join(rulesetsDir, category);
		const files = fs
			.readdirSync(categoryPath)
			.filter((file) => file.endsWith('.xml'));

		files.forEach((file) => {
			const filePath = path.join(categoryPath, file);
			const rules = extractRulesFromFile(filePath);
			combinedRuleset.rules = combinedRuleset.rules.concat(rules);
		});
	});

	// Generate XML
	const xml = generateRulesetXML(combinedRuleset);

	// Ensure output directory exists
	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	// Write to file
	fs.writeFileSync(outputPath, xml, 'utf-8');
	console.log(`✅ Generated test ruleset: ${outputPath}`);
	console.log(`   Total rules: ${combinedRuleset.rules.length}`);
}

/**
 * Extract rules from a ruleset XML file
 */
function extractRulesFromFile(filePath) {
	const content = fs.readFileSync(filePath, 'utf-8');
	const parser = new DOMParser();
	const doc = parser.parseFromString(content, 'text/xml');
	const rules = [];

	const ruleElements = doc.getElementsByTagName('rule');
	for (let i = 0; i < ruleElements.length; i++) {
		const ruleElement = ruleElements[i];
		const serializer = new XMLSerializer();
		rules.push(serializer.serializeToString(ruleElement));
	}

	return rules;
}

/**
 * Generate XML for combined ruleset
 */
function generateRulesetXML(ruleset) {
	let xml = `<?xml version="1.0" ?>
<ruleset
    name="${ruleset.name}"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd"
>
    <description>${ruleset.description}</description>

`;

	ruleset.rules.forEach((ruleXML) => {
		// Remove XML declaration if present
		const cleanRule = ruleXML.replace(/<\?xml[^>]*\?>/g, '').trim();
		xml += `    ${cleanRule}\n\n`;
	});

	xml += '</ruleset>\n';
	return xml;
}

// Run generation
if (require.main === module) {
	generateTestRuleset();
}

module.exports = { generateTestRuleset };
