module.exports = {
	testEnvironment: 'node',
	// Explicitly match test files in tests/unit directory
	testMatch: ['**/tests/unit/**/*.test.js', '**/tests/**/*.test.js'],
	testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
	collectCoverageFrom: [
		'scripts/**/*.js',
		'tests/helpers/**/*.js',
		'!**/*.test.js',
		'!tests/fixtures/**',
		'!tests/rulesets/**',
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	verbose: true,
	testTimeout: 10000,
	// Ensure all test files are discovered
	roots: ['<rootDir>'],
};
