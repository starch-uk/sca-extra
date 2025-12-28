#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Bump version in package.json
 */
function bumpVersion(type = 'patch') {
	const packagePath = path.join(__dirname, '..', 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

	const version = packageJson.version.split('.');
	let major = parseInt(version[0], 10);
	let minor = parseInt(version[1], 10);
	let patch = parseInt(version[2], 10);

	switch (type) {
		case 'major':
			major++;
			minor = 0;
			patch = 0;
			break;
		case 'minor':
			minor++;
			patch = 0;
			break;
		case 'patch':
		default:
			patch++;
			break;
	}

	const newVersion = `${major}.${minor}.${patch}`;
	packageJson.version = newVersion;

	fs.writeFileSync(
		packagePath,
		JSON.stringify(packageJson, null, 2) + '\n',
		'utf-8'
	);
	console.log(`✅ Version bumped to ${newVersion}`);
}

// Run version bump
if (require.main === module) {
	const type = process.argv[2] || 'patch';
	if (!['major', 'minor', 'patch'].includes(type)) {
		console.error('❌ Invalid version type. Use: major, minor, or patch');
		process.exit(1);
	}
	bumpVersion(type);
}

module.exports = { bumpVersion };
