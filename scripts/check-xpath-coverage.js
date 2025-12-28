#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { DOMParser } = require('xmldom');

/**
 * Extract XPath expression from XML rule file
 */
function extractXPath(xmlFilePath) {
	const content = fs.readFileSync(xmlFilePath, 'utf-8');
	const parser = new DOMParser();
	const doc = parser.parseFromString(content, 'text/xml');

	const properties = doc.getElementsByTagName('properties')[0];
	if (!properties) return null;

	const xpathProperty = Array.from(
		properties.getElementsByTagName('property')
	).find((prop) => prop.getAttribute('name') === 'xpath');

	if (!xpathProperty) return null;

	const valueElement = xpathProperty.getElementsByTagName('value')[0];
	if (!valueElement) return null;

	return valueElement.textContent.trim();
}

/**
 * Analyze XPath to identify node types and patterns
 */
function analyzeXPath(xpath) {
	if (!xpath) return { nodeTypes: [] };

	const nodeTypes = new Set();

	// Extract node types (e.g., IfBlockStatement, WhileLoopStatement)
	// Match patterns like: //IfBlockStatement, IfBlockStatement[, IfBlockStatement/, etc.
	// Focus on actual AST node types, not modifiers or attributes
	const nodeTypeMatches = xpath.matchAll(
		/(?:^|\s|\(|\[|,|\|)([A-Z][a-zA-Z]*(?:Statement|Expression|Declaration|Method|Class|Field|Block|Condition|Loop|Type|Node))(?:\s*\[|\s*\(|\s*\/|\s*$|\s*,|\s*\|)/g
	);
	for (const match of nodeTypeMatches) {
		const nodeType = match[1];
		// Filter out common non-node-type words and attributes
		if (
			![
				'let',
				'return',
				'if',
				'then',
				'else',
				'and',
				'or',
				'not',
				'exists',
				'count',
				'sum',
				'for',
				'in',
				'satisfies',
				'ancestor',
				'descendant',
				'following',
				'preceding',
				'parent',
				'child',
				'self',
				'sibling',
				'ModifierNode',
			].includes(nodeType) &&
			nodeType.length > 3 &&
			// Only include if it looks like an AST node type
			(nodeType.endsWith('Statement') ||
				nodeType.endsWith('Expression') ||
				nodeType.endsWith('Declaration') ||
				nodeType === 'Method' ||
				nodeType === 'Class' ||
				nodeType === 'Field' ||
				nodeType === 'Block' ||
				nodeType === 'Condition' ||
				nodeType === 'Loop' ||
				nodeType === 'Type' ||
				nodeType === 'FormalComment')
		) {
			nodeTypes.add(nodeType);
		}
	}

	// Extract operators
	const operators = new Set();
	const opMatches = xpath.matchAll(/@Op\s*=\s*['"]([^'"]+)['"]/g);
	for (const match of opMatches) {
		operators.add(match[1]);
	}

	// Extract attribute checks
	const attributes = new Set();
	const attrMatches = xpath.matchAll(/@([A-Z][a-zA-Z]*)\s*=/g);
	for (const match of attrMatches) {
		attributes.add(match[1]);
	}

	// Check for union operators (|) which indicate multiple paths
	const hasUnions = xpath.includes('|') && !xpath.includes('||');

	// Check for let expressions (complex logic)
	const hasLetExpressions = xpath.includes('let ');

	return {
		nodeTypes: Array.from(nodeTypes),
		operators: Array.from(operators),
		attributes: Array.from(attributes),
		hasUnions,
		hasLetExpressions,
		patterns: [], // Reserved for future pattern analysis
	};
}

/**
 * Check if test fixtures exist and contain relevant code patterns
 */
function checkFixtureCoverage(ruleName, category, xpathAnalysis) {
	const negativeFixture = path.join(
		__dirname,
		'..',
		'tests',
		'fixtures',
		'negative',
		category,
		`${ruleName}.cls`
	);
	const positiveFixture = path.join(
		__dirname,
		'..',
		'tests',
		'fixtures',
		'positive',
		category,
		`${ruleName}.cls`
	);

	const coverage = {
		hasNegativeFixture: fs.existsSync(negativeFixture),
		hasPositiveFixture: fs.existsSync(positiveFixture),
		negativeContent: null,
		positiveContent: null,
		coveredNodeTypes: new Set(),
		missingNodeTypes: [],
	};

	if (coverage.hasNegativeFixture) {
		coverage.negativeContent = fs.readFileSync(negativeFixture, 'utf-8');
	}

	if (coverage.hasPositiveFixture) {
		coverage.positiveContent = fs.readFileSync(positiveFixture, 'utf-8');
	}

	// Check if node types are covered in fixtures
	// This is a simple heuristic - check if the fixture contains code that would match
	// For example, IfBlockStatement would match "if" statements
	const nodeTypeMap = {
		IfBlockStatement: ['if', 'else if'],
		IfElseBlockStatement: ['if', 'else if', 'else'],
		WhileLoopStatement: ['while'],
		ForLoopStatement: ['for'],
		SwitchStatement: ['switch'],
		TernaryExpression: ['?', ':', 'ternary'],
		MethodCallExpression: ['(', 'method'],
		VariableExpression: [
			'variable',
			'var',
			'=',
			'String',
			'Integer',
			'Boolean',
			'Object',
			'List',
			'Map',
			'Set',
		],
		VariableDeclaration: [
			'=',
			'declaration',
			'String',
			'Integer',
			'Boolean',
		],
		Method: ['method', 'function', 'void', 'public', 'private'],
		Field: ['field', 'property', 'static', 'final'],
		Class: ['class'],
		BlockStatement: ['{', '}', 'block'],
		NewMapInitExpression: ['new Map', 'Map<', 'Map('],
		ReferenceExpression: ['reference', 'ref', '.', 'this.', 'super.'],
		FormalComment: ['/**', '*/', 'apexdoc'],
		BinaryExpression: ['==', '!=', '<', '>', '<=', '>='],
	};

	xpathAnalysis.nodeTypes.forEach((nodeType) => {
		const keywords = nodeTypeMap[nodeType] || [];
		const allContent =
			(coverage.negativeContent || '') +
			' ' +
			(coverage.positiveContent || '');
		const isCovered = keywords.some((keyword) =>
			allContent.toLowerCase().includes(keyword.toLowerCase())
		);
		if (isCovered) {
			coverage.coveredNodeTypes.add(nodeType);
		} else {
			coverage.missingNodeTypes.push(nodeType);
		}
	});

	return coverage;
}

/**
 * Check XPath coverage for all XML rules
 */
function checkXPathCoverage() {
	const rulesetsDir = path.join(__dirname, '..', 'rulesets');
	const categories = fs
		.readdirSync(rulesetsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	const results = [];
	let totalRules = 0;
	let fullyCovered = 0;
	let partiallyCovered = 0;
	let notCovered = 0;

	categories.forEach((category) => {
		const categoryPath = path.join(rulesetsDir, category);
		const files = fs
			.readdirSync(categoryPath)
			.filter((file) => file.endsWith('.xml'));

		files.forEach((file) => {
			totalRules++;
			const ruleName = path.basename(file, '.xml');
			const xmlPath = path.join(categoryPath, file);

			const xpath = extractXPath(xmlPath);
			if (!xpath) {
				results.push({
					ruleName,
					category,
					status: 'no-xpath',
					message: 'No XPath expression found',
				});
				return;
			}

			const analysis = analyzeXPath(xpath);
			const fixtureCoverage = checkFixtureCoverage(
				ruleName,
				category,
				analysis
			);

			const hasBothFixtures =
				fixtureCoverage.hasNegativeFixture &&
				fixtureCoverage.hasPositiveFixture;
			const allNodeTypesCovered =
				analysis.nodeTypes.length === 0 ||
				fixtureCoverage.missingNodeTypes.length === 0;

			let status;
			let message = '';

			if (!hasBothFixtures) {
				status = 'not-covered';
				notCovered++;
				if (!fixtureCoverage.hasNegativeFixture) {
					message += 'Missing negative fixture. ';
				}
				if (!fixtureCoverage.hasPositiveFixture) {
					message += 'Missing positive fixture. ';
				}
			} else if (!allNodeTypesCovered) {
				status = 'partial';
				partiallyCovered++;
				message = `Missing coverage for node types: ${fixtureCoverage.missingNodeTypes.join(', ')}. `;
			} else {
				status = 'covered';
				fullyCovered++;
			}

			if (analysis.hasUnions) {
				message +=
					'XPath contains union operators (|) - ensure all branches are tested. ';
			}
			if (analysis.hasLetExpressions) {
				message +=
					'XPath contains let expressions - ensure all conditions are tested. ';
			}

			results.push({
				ruleName,
				category,
				status,
				message: message.trim(),
				nodeTypes: analysis.nodeTypes,
				missingNodeTypes: fixtureCoverage.missingNodeTypes,
			});
		});
	});

	// Report results
	console.log('\n📊 XPath Coverage Report\n');
	console.log(`Total XML Rules: ${totalRules}`);
	console.log(
		`Fully Covered: ${fullyCovered} (${((fullyCovered / totalRules) * 100).toFixed(1)}%)`
	);
	console.log(
		`Partially Covered: ${partiallyCovered} (${((partiallyCovered / totalRules) * 100).toFixed(1)}%)`
	);
	console.log(
		`Not Covered: ${notCovered} (${((notCovered / totalRules) * 100).toFixed(1)}%)\n`
	);

	const issues = results.filter((r) => r.status !== 'covered');
	if (issues.length > 0) {
		console.log('⚠️  Rules with coverage issues:\n');
		issues.forEach((result) => {
			console.log(`  ${result.category}/${result.ruleName}`);
			if (result.message) {
				console.log(`    ${result.message}`);
			}
			if (result.missingNodeTypes.length > 0) {
				console.log(
					`    Missing node types: ${result.missingNodeTypes.join(', ')}`
				);
			}
			console.log('');
		});
	}

	if (issues.length === 0) {
		console.log('✅ All XPath expressions have full coverage!');
		return 0;
	} else {
		return 1;
	}
}

// Run coverage check
if (require.main === module) {
	process.exit(checkXPathCoverage());
}

module.exports = { checkXPathCoverage, extractXPath, analyzeXPath };
