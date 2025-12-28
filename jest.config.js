module.exports = {
	testEnvironment: 'node',
	// Explicitly match test files in tests/unit directory
	testMatch: ['**/tests/unit/**/*.test.js', '**/tests/**/*.test.js'],
	testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
	// Coverage is tracked via scripts/check-rule-coverage.js for XML rule files
	// Jest coverage is disabled since it can't instrument XML files
	collectCoverage: false,
	verbose: true,
	testTimeout: 10000,
	// Ensure all test files are discovered
	roots: ['<rootDir>'],
};
