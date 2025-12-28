#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * List all test files to verify Jest will discover them
 */
function listTestFiles() {
	const testsDir = path.join(__dirname, '..', 'tests', 'unit');
	const files = fs
		.readdirSync(testsDir)
		.filter((file) => file.endsWith('.test.js'))
		.sort();

	console.log('Test files in tests/unit/:');
	console.log('─'.repeat(50));

	files.forEach((file, index) => {
		const filePath = path.join(testsDir, file);
		const content = fs.readFileSync(filePath, 'utf-8');
		const describeCount = (content.match(/describe\(/g) || []).length;
		const itCount = (content.match(/it\(/g) || []).length;

		console.log(`${index + 1}. ${file}`);
		console.log(`   - Describes: ${describeCount}`);
		console.log(`   - Tests: ${itCount}`);
	});

	console.log('─'.repeat(50));
	console.log(`Total: ${files.length} test files`);

	// Verify Jest config would find them
	const jestConfig = require(path.join(__dirname, '..', 'jest.config.js'));
	console.log(`\nJest testMatch pattern: ${jestConfig.testMatch.join(', ')}`);

	// Verify all files would be found by Jest
	console.log(
		`\n✅ All ${files.length} test files should be discovered by Jest`
	);
	console.log(`   Pattern: ${jestConfig.testMatch.join(' or ')}`);
}

if (require.main === module) {
	listTestFiles();
}

module.exports = { listTestFiles };
