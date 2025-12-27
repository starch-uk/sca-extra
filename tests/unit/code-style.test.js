const { runPMD, assertNoViolations } = require('../helpers/pmd-helper');

describe('Code Style Rules', () => {
	describe('NoMethodCallsInConditionals', () => {
		it('should detect method calls in if conditions', async () => {
			const violations = await runPMD(
				'rulesets/code-style/NoMethodCallsInConditionals.xml',
				'tests/fixtures/negative/code-style/NoMethodCallsInConditionals.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'NoMethodCallsInConditionals').length
			).toBeGreaterThan(0);
		});

		it('should not flag code with method results stored in variables', async () => {
			const violations = await runPMD(
				'rulesets/code-style/NoMethodCallsInConditionals.xml',
				'tests/fixtures/positive/code-style/NoMethodCallsInConditionals.cls'
			);
			assertNoViolations(violations, 'NoMethodCallsInConditionals');
		});
	});

	describe('NoMethodChaining', () => {
		it('should detect method chaining', async () => {
			const violations = await runPMD(
				'rulesets/code-style/NoMethodChaining.xml',
				'tests/fixtures/negative/code-style/NoMethodChaining.cls'
			);
			expect(violations.filter((v) => v.rule === 'NoMethodChaining').length).toBeGreaterThan(
				0
			);
		});

		it('should not flag code using intermediary variables', async () => {
			const violations = await runPMD(
				'rulesets/code-style/NoMethodChaining.xml',
				'tests/fixtures/positive/code-style/NoMethodChaining.cls'
			);
			assertNoViolations(violations, 'NoMethodChaining');
		});
	});

	describe('PreferSafeNavigationOperator', () => {
		it('should detect explicit null checks before property access', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferSafeNavigationOperator.xml',
				'tests/fixtures/negative/code-style/PreferSafeNavigationOperator.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'PreferSafeNavigationOperator').length
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
				violations.filter((v) => v.rule === 'PreferNullCoalescingOverTernary').length
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
				violations.filter((v) => v.rule === 'AvoidOneLinerMethods').length
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

	describe('ListInitializationMustBeMultiLine', () => {
		it('should detect list initializations with 2+ items on same line', async () => {
			const violations = await runPMD(
				'rulesets/code-style/ListInitializationMustBeMultiLine.xml',
				'tests/fixtures/negative/code-style/ListInitializationMustBeMultiLine.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'ListInitializationMustBeMultiLine').length
			).toBeGreaterThan(0);
		});

		it('should not flag single-item lists or multi-line lists', async () => {
			const violations = await runPMD(
				'rulesets/code-style/ListInitializationMustBeMultiLine.xml',
				'tests/fixtures/positive/code-style/ListInitializationMustBeMultiLine.cls'
			);
			assertNoViolations(violations, 'ListInitializationMustBeMultiLine');
		});
	});

	describe('MapInitializationMustBeMultiLine', () => {
		it('should detect map initializations with 2+ entries on same line', async () => {
			const violations = await runPMD(
				'rulesets/code-style/MapInitializationMustBeMultiLine.xml',
				'tests/fixtures/negative/code-style/MapInitializationMustBeMultiLine.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'MapInitializationMustBeMultiLine').length
			).toBeGreaterThan(0);
		});

		it('should not flag single-entry maps or multi-line maps', async () => {
			const violations = await runPMD(
				'rulesets/code-style/MapInitializationMustBeMultiLine.xml',
				'tests/fixtures/positive/code-style/MapInitializationMustBeMultiLine.cls'
			);
			assertNoViolations(violations, 'MapInitializationMustBeMultiLine');
		});
	});

	describe('NoConsecutiveBlankLines', () => {
		it('should detect consecutive blank lines', async () => {
			const { runRegexRule } = require('../helpers/pmd-helper');
			const violations = await runRegexRule(
				'/\\n\\s*\\n\\s*\\n/g',
				'tests/fixtures/negative/code-style/NoConsecutiveBlankLines.cls',
				'NoConsecutiveBlankLines',
				'Two or more consecutive blank lines are not allowed. Use at most one blank line between statements.'
			);
			expect(
				violations.filter((v) => v.rule === 'NoConsecutiveBlankLines').length
			).toBeGreaterThan(0);
		});

		it('should not flag single blank lines', async () => {
			const { runRegexRule } = require('../helpers/pmd-helper');
			const violations = await runRegexRule(
				'/\\n\\s*\\n\\s*\\n/g',
				'tests/fixtures/positive/code-style/NoConsecutiveBlankLines.cls',
				'NoConsecutiveBlankLines',
				'Two or more consecutive blank lines are not allowed. Use at most one blank line between statements.'
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
					(file) => file.startsWith('ProhibitSuppressWarnings_') && file.endsWith('.cls')
				);

			expect(files.length).toBeGreaterThan(0);

			for (const file of files) {
				const filePath = path.join(negativeDir, file);
				const violations = await runRegexRule(
					'/@SuppressWarnings\\([^)]*\\)|\\/\\/\\s*NOPMD/gi',
					filePath,
					'ProhibitSuppressWarnings',
					'Suppression of warnings is not allowed. Fix the underlying issue or improve the rule instead of suppressing violations.'
				);
				expect(
					violations.filter((v) => v.rule === 'ProhibitSuppressWarnings').length
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
					(file) => file.startsWith('ProhibitSuppressWarnings_') && file.endsWith('.cls')
				);

			expect(files.length).toBeGreaterThan(0);

			for (const file of files) {
				const filePath = path.join(positiveDir, file);
				const violations = await runRegexRule(
					'/@SuppressWarnings\\([^)]*\\)|\\/\\/\\s*NOPMD/gi',
					filePath,
					'ProhibitSuppressWarnings',
					'Suppression of warnings is not allowed. Fix the underlying issue or improve the rule instead of suppressing violations.'
				);
				assertNoViolations(violations, 'ProhibitSuppressWarnings');
			}
		});
	});

	describe('NoMethodCallsAsArguments', () => {
		it('should detect method calls used directly as arguments', async () => {
			const violations = await runPMD(
				'rulesets/code-style/NoMethodCallsAsArguments.xml',
				'tests/fixtures/negative/code-style/NoMethodCallsAsArguments.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'NoMethodCallsAsArguments').length
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
				violations.filter((v) => v.rule === 'SingleArgumentMustBeSingleLine').length
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
				violations.filter((v) => v.rule === 'PreferStringJoinOverConcatenation').length
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
				violations.filter((v) => v.rule === 'MultipleStringContainsCalls').length
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
				violations.filter((v) => v.rule === 'MapShouldBeInitializedWithValues').length
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
				violations.filter((v) => v.rule === 'PreferStringJoinOverMultipleNewlines').length
			).toBeGreaterThan(0);
		});

		it('should not flag String.join usage or strings with single/no newlines', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferStringJoinOverMultipleNewlines.xml',
				'tests/fixtures/positive/code-style/PreferStringJoinOverMultipleNewlines.cls'
			);
			assertNoViolations(violations, 'PreferStringJoinOverMultipleNewlines');
		});
	});

	describe('PreferConcatenationOverStringJoinWithEmpty', () => {
		it('should detect String.join() with empty separator', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferConcatenationOverStringJoinWithEmpty.xml',
				'tests/fixtures/negative/code-style/PreferConcatenationOverStringJoinWithEmpty.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'PreferConcatenationOverStringJoinWithEmpty')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag concatenation or String.join with non-empty separator', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferConcatenationOverStringJoinWithEmpty.xml',
				'tests/fixtures/positive/code-style/PreferConcatenationOverStringJoinWithEmpty.cls'
			);
			assertNoViolations(violations, 'PreferConcatenationOverStringJoinWithEmpty');
		});
	});

	describe('PreferMethodCallsInLoopConditions', () => {
		it('should detect while(true/false) with break and method call inside', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferMethodCallsInLoopConditions.xml',
				'tests/fixtures/negative/code-style/PreferMethodCallsInLoopConditions.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'PreferMethodCallsInLoopConditions').length
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
				violations.filter((v) => v.rule === 'PreferBuilderPatternChaining').length
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
				violations.filter((v) => v.rule === 'PreferStringJoinWithSeparatorOverEmpty').length
			).toBeGreaterThan(0);
		});

		it('should not flag String.join with separator or without common suffix', async () => {
			const violations = await runPMD(
				'rulesets/code-style/PreferStringJoinWithSeparatorOverEmpty.xml',
				'tests/fixtures/positive/code-style/PreferStringJoinWithSeparatorOverEmpty.cls'
			);
			assertNoViolations(violations, 'PreferStringJoinWithSeparatorOverEmpty');
		});
	});
});
