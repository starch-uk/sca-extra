#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Recursively find all files matching the given pattern
 * @param {string} dir - Directory to search
 * @param {string} pattern - File pattern to match (e.g., '.ast.xml')
 * @param {string[]} fileList - Accumulator for found files
 * @returns {string[]} Array of file paths
 */
function findFiles(dir, pattern, fileList = []) {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			findFiles(filePath, pattern, fileList);
		} else if (file.endsWith(pattern)) {
			fileList.push(filePath);
		}
	});

	return fileList;
}

/**
 * Clean up generated files (*.ast.xml and *.override.xml)
 */
function clean() {
	const projectRoot = path.join(__dirname, '..');
	const astFiles = findFiles(projectRoot, '.ast.xml');
	const overrideFiles = findFiles(projectRoot, '.override.xml');

	const allFiles = [...astFiles, ...overrideFiles];

	if (allFiles.length === 0) {
		console.log('✅ No files to clean.');
		return;
	}

	console.log(`Found ${allFiles.length} file(s) to remove:`);
	allFiles.forEach((file) => {
		const relativePath = path.relative(projectRoot, file);
		console.log(`  - ${relativePath}`);
	});

	allFiles.forEach((file) => {
		try {
			fs.unlinkSync(file);
		} catch (error) {
			console.error(`❌ Error removing ${file}: ${error.message}`);
			process.exit(1);
		}
	});

	console.log(`\n✅ Successfully removed ${allFiles.length} file(s).`);
}

clean();
