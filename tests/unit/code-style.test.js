const { runPMD, assertNoViolations } = require('../helpers/pmd-helper');

describe('Code Style Rules', () => {
	describe('NoMethodCallsInConditionals', () => {
		it('should detect method calls in if conditions', async () => {
			const violations = await runPMD(
				'rulesets/code-style/NoMethodCallsInConditionals.xml',
				'tests/fixtures/negative/code-style/NoMethodCallsInConditionals.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'NoMethodCallsInConditionals'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag code with method results stored in variables', async () => {
			const violations = await runPMD(
				'rulesets/code-style/NoMethodCallsInConditionals.xml',
				'tests/fixtures/positive/code-style/NoMethodCallsInConditionals.cls'
			);
			assertNoViolations(violations, 'NoMethodCallsInConditionals');
		});

		it('should not flag method calls in while loops', async () => {
			const testCode = `public class TestWhile {
				public void test() {
					while (hasMore()) {
						process();
					}
				}
				private Boolean hasMore() { return true; }
				private void process() { }
			}`;
			const fs = require('fs');
			const path = require('path');
			const os = require('os');
			const tmpFile = path.join(os.tmpdir(), 'test-while.cls');
			fs.writeFileSync(tmpFile, testCode);

			try {
				const violations = await runPMD(
					'rulesets/code-style/NoMethodCallsInConditionals.xml',
					tmpFile
				);
				assertNoViolations(violations, 'NoMethodCallsInConditionals');
			} finally {
				if (fs.existsSync(tmpFile)) {
					fs.unlinkSync(tmpFile);
				}
			}
		});

		it('should not flag method calls in do-while loops', async () => {
			const testCode = `public class TestDoWhile {
				public void test() {
					do {
						process();
					} while (hasMore());
				}
				private Boolean hasMore() { return true; }
				private void process() { }
			}`;
			const fs = require('fs');
			const path = require('path');
			const os = require('os');
			const tmpFile = path.join(os.tmpdir(), 'test-dowhile.cls');
			fs.writeFileSync(tmpFile, testCode);

			try {
				const violations = await runPMD(
					'rulesets/code-style/NoMethodCallsInConditionals.xml',
					tmpFile
				);
				assertNoViolations(violations, 'NoMethodCallsInConditionals');
			} finally {
				if (fs.existsSync(tmpFile)) {
					fs.unlinkSync(tmpFile);
				}
			}
		});
	});

	describe('PreferSafeNavigationOperator', () => {
		it('should detect explicit null checks before property access', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferSafeNavigationOperator.xml',
				'tests/fixtures/negative/code-style/PreferSafeNavigationOperator.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferSafeNavigationOperator'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag code using safe navigation operator', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferSafeNavigationOperator.xml',
				'tests/fixtures/positive/code-style/PreferSafeNavigationOperator.cls'
			);
			assertNoViolations(violations, 'PreferSafeNavigationOperator');
		});
	});

	describe('PreferNullCoalescingOverTernary', () => {
		it('should detect ternary operators for null checks', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferNullCoalescingOverTernary.xml',
				'tests/fixtures/negative/code-style/PreferNullCoalescingOverTernary.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferNullCoalescingOverTernary'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag code using null coalescing operator', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferNullCoalescingOverTernary.xml',
				'tests/fixtures/positive/code-style/PreferNullCoalescingOverTernary.cls'
			);
			assertNoViolations(violations, 'PreferNullCoalescingOverTernary');
		});
	});

	describe('AvoidOneLinerMethods', () => {
		it('should detect one-liner methods with single statement', async () => {
			const violations = await runPMD(
				'rulesets/code-style/AvoidOneLinerMethods.xml',
				'tests/fixtures/negative/code-style/AvoidOneLinerMethods.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'AvoidOneLinerMethods')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag abstract, override, interface, or multi-statement methods', async () => {
			const violations = await runPMD(
				'rulesets/code-style/AvoidOneLinerMethods.xml',
				'tests/fixtures/positive/code-style/AvoidOneLinerMethods.cls'
			);
			assertNoViolations(violations, 'AvoidOneLinerMethods');
		});
	});

	describe('NoConsecutiveBlankLines', () => {
		it('should detect consecutive blank lines', async () => {
			const { runRegexRule } = require('../helpers/pmd-helper');
			const violations = await runRegexRule(
				'NoConsecutiveBlankLines',
				'tests/fixtures/negative/code-style/NoConsecutiveBlankLines.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'NoConsecutiveBlankLines')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag single blank lines', async () => {
			const { runRegexRule } = require('../helpers/pmd-helper');
			const violations = await runRegexRule(
				'NoConsecutiveBlankLines',
				'tests/fixtures/positive/code-style/NoConsecutiveBlankLines.cls'
			);
			assertNoViolations(violations, 'NoConsecutiveBlankLines');
		});
	});

	describe('ProhibitSuppressWarnings', () => {
		it('should detect @SuppressWarnings annotations and NOPMD comments', async () => {
			const fs = require('fs');
			const path = require('path');
			const { runRegexRule } = require('../helpers/pmd-helper');
			const negativeDir = 'tests/fixtures/negative/code-style';
			const files = fs
				.readdirSync(negativeDir)
				.filter(
					(file) =>
						file.startsWith('ProhibitSuppressWarnings_') &&
						file.endsWith('.cls')
				);

			expect(files.length).toBeGreaterThan(0);

			for (const file of files) {
				const filePath = path.join(negativeDir, file);
				const violations = await runRegexRule(
					'ProhibitSuppressWarnings',
					filePath
				);
				expect(
					violations.filter(
						(v) => v.rule === 'ProhibitSuppressWarnings'
					).length
				).toBeGreaterThan(0);
			}
		});

		it('should not flag code without suppressions', async () => {
			const fs = require('fs');
			const path = require('path');
			const { runRegexRule } = require('../helpers/pmd-helper');
			const positiveDir = 'tests/fixtures/positive/code-style';
			const files = fs
				.readdirSync(positiveDir)
				.filter(
					(file) =>
						file.startsWith('ProhibitSuppressWarnings_') &&
						file.endsWith('.cls')
				);

			expect(files.length).toBeGreaterThan(0);

			for (const file of files) {
				const filePath = path.join(positiveDir, file);
				const violations = await runRegexRule(
					'ProhibitSuppressWarnings',
					filePath
				);
				assertNoViolations(violations, 'ProhibitSuppressWarnings');
			}
		});
	});

	describe('NoLongLines', () => {
		it('should detect lines longer than 80 characters', async () => {
			const { runRegexRule } = require('../helpers/pmd-helper');
			const violations = await runRegexRule(
				'NoLongLines',
				'tests/fixtures/negative/code-style/NoLongLines.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'NoLongLines').length
			).toBeGreaterThan(0);
		});

		it('should not flag lines 80 characters or shorter', async () => {
			const { runRegexRule } = require('../helpers/pmd-helper');
			const violations = await runRegexRule(
				'NoLongLines',
				'tests/fixtures/positive/code-style/NoLongLines.cls'
			);
			assertNoViolations(violations, 'NoLongLines');
		});
	});

	describe('NoMethodCallsAsArguments', () => {
		it('should detect method calls used directly as arguments', async () => {
			const violations = await runPMD(
				'rulesets/code-style/NoMethodCallsAsArguments.xml',
				'tests/fixtures/negative/code-style/NoMethodCallsAsArguments.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'NoMethodCallsAsArguments')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag method calls extracted to variables', async () => {
			const violations = await runPMD(
				'rulesets/code-style/NoMethodCallsAsArguments.xml',
				'tests/fixtures/positive/code-style/NoMethodCallsAsArguments.cls'
			);
			assertNoViolations(violations, 'NoMethodCallsAsArguments');
		});
	});

	describe('SingleArgumentMustBeSingleLine', () => {
		it('should detect single-argument method calls on multiple lines', async () => {
			const violations = await runPMD(
				'rulesets/code-style/SingleArgumentMustBeSingleLine.xml',
				'tests/fixtures/negative/code-style/SingleArgumentMustBeSingleLine.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'SingleArgumentMustBeSingleLine'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag single-argument method calls on one line', async () => {
			const violations = await runPMD(
				'rulesets/code-style/SingleArgumentMustBeSingleLine.xml',
				'tests/fixtures/positive/code-style/SingleArgumentMustBeSingleLine.cls'
			);
			assertNoViolations(violations, 'SingleArgumentMustBeSingleLine');
		});
	});

	describe('PreferStringJoinOverConcatenation', () => {
		it('should detect multiple string concatenations with common separator', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferStringJoinOverConcatenation.xml',
				'tests/fixtures/negative/code-style/PreferStringJoinOverConcatenation.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferStringJoinOverConcatenation'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag String.join usage or concatenations without common separator', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferStringJoinOverConcatenation.xml',
				'tests/fixtures/positive/code-style/PreferStringJoinOverConcatenation.cls'
			);
			assertNoViolations(violations, 'PreferStringJoinOverConcatenation');
		});
	});

	describe('MultipleStringContainsCalls', () => {
		it('should detect multiple contains() calls in conditionals', async () => {
			const violations = await runPMD(
				'rulesets/code-style/MultipleStringContainsCalls.xml',
				'tests/fixtures/negative/code-style/MultipleStringContainsCalls.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'MultipleStringContainsCalls'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag single contains() calls or regex patterns', async () => {
			const violations = await runPMD(
				'rulesets/code-style/MultipleStringContainsCalls.xml',
				'tests/fixtures/positive/code-style/MultipleStringContainsCalls.cls'
			);
			assertNoViolations(violations, 'MultipleStringContainsCalls');
		});
	});

	describe('MapShouldBeInitializedWithValues', () => {
		it('should detect empty maps followed immediately by put()', async () => {
			const violations = await runPMD(
				'rulesets/code-style/MapShouldBeInitializedWithValues.xml',
				'tests/fixtures/negative/code-style/MapShouldBeInitializedWithValues.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'MapShouldBeInitializedWithValues'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag maps initialized with values or put() called later', async () => {
			const violations = await runPMD(
				'rulesets/code-style/MapShouldBeInitializedWithValues.xml',
				'tests/fixtures/positive/code-style/MapShouldBeInitializedWithValues.cls'
			);
			assertNoViolations(violations, 'MapShouldBeInitializedWithValues');
		});
	});

	describe('PreferStringJoinOverMultipleNewlines', () => {
		it('should detect strings with multiple newlines', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferStringJoinOverMultipleNewlines.xml',
				'tests/fixtures/negative/code-style/PreferStringJoinOverMultipleNewlines.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferStringJoinOverMultipleNewlines'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag String.join usage or strings with single/no newlines', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferStringJoinOverMultipleNewlines.xml',
				'tests/fixtures/positive/code-style/PreferStringJoinOverMultipleNewlines.cls'
			);
			assertNoViolations(
				violations,
				'PreferStringJoinOverMultipleNewlines'
			);
		});
	});

	describe('PreferConcatenationOverStringJoinWithEmpty', () => {
		it('should detect String.join() with empty separator', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferConcatenationOverStringJoinWithEmpty.xml',
				'tests/fixtures/negative/code-style/PreferConcatenationOverStringJoinWithEmpty.cls'
			);
			expect(
				violations.filter(
					(v) =>
						v.rule === 'PreferConcatenationOverStringJoinWithEmpty'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag concatenation or String.join with non-empty separator', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferConcatenationOverStringJoinWithEmpty.xml',
				'tests/fixtures/positive/code-style/PreferConcatenationOverStringJoinWithEmpty.cls'
			);
			assertNoViolations(
				violations,
				'PreferConcatenationOverStringJoinWithEmpty'
			);
		});
	});

	describe('PreferMethodCallsInLoopConditions', () => {
		it('should detect while(true/false) with break and method call inside', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferMethodCallsInLoopConditions.xml',
				'tests/fixtures/negative/code-style/PreferMethodCallsInLoopConditions.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferMethodCallsInLoopConditions'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag method calls in loop conditions or breaks without method calls', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferMethodCallsInLoopConditions.xml',
				'tests/fixtures/positive/code-style/PreferMethodCallsInLoopConditions.cls'
			);
			assertNoViolations(violations, 'PreferMethodCallsInLoopConditions');
		});
	});

	describe('PreferBuilderPatternChaining', () => {
		it('should detect builder pattern with intermediary variable assignments', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferBuilderPatternChaining.xml',
				'tests/fixtures/negative/code-style/PreferBuilderPatternChaining.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferBuilderPatternChaining'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag method chaining or assignments in constructors', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferBuilderPatternChaining.xml',
				'tests/fixtures/positive/code-style/PreferBuilderPatternChaining.cls'
			);
			assertNoViolations(violations, 'PreferBuilderPatternChaining');
		});
	});

	describe('PreferStringJoinWithSeparatorOverEmpty', () => {
		it('should detect String.join with empty separator when strings have common suffix', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferStringJoinWithSeparatorOverEmpty.xml',
				'tests/fixtures/negative/code-style/PreferStringJoinWithSeparatorOverEmpty.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferStringJoinWithSeparatorOverEmpty'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag String.join with separator or without common suffix', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferStringJoinWithSeparatorOverEmpty.xml',
				'tests/fixtures/positive/code-style/PreferStringJoinWithSeparatorOverEmpty.cls'
			);
			assertNoViolations(
				violations,
				'PreferStringJoinWithSeparatorOverEmpty'
			);
		});
	});

	describe('ProhibitPrettierIgnore', () => {
		it('should detect prettier-ignore comments', async () => {
			const { runRegexRule } = require('../helpers/pmd-helper');
			const violations = await runRegexRule(
				'ProhibitPrettierIgnore',
				'tests/fixtures/negative/code-style/ProhibitPrettierIgnore.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'ProhibitPrettierIgnore')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag code without prettier-ignore comments', async () => {
			const { runRegexRule } = require('../helpers/pmd-helper');
			const violations = await runRegexRule(
				'ProhibitPrettierIgnore',
				'tests/fixtures/positive/code-style/ProhibitPrettierIgnore.cls'
			);
			assertNoViolations(violations, 'ProhibitPrettierIgnore');
		});
	});
});
