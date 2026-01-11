const { runPMD, assertNoViolations } = require('../helpers/pmd-helper');

describe('Code Style Rules', () => {
	describe('NoMethodCallsInConditionals', () => {
		it('should detect method calls in if conditions', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/NoMethodCallsInConditionals.xml',
				'tests/fixtures/negative/codestyle/NoMethodCallsInConditionals.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'NoMethodCallsInConditionals'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag code with method results stored in variables or method calls in while/do-while loops', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/NoMethodCallsInConditionals.xml',
				'tests/fixtures/positive/codestyle/NoMethodCallsInConditionals.cls'
			);
			assertNoViolations(violations, 'NoMethodCallsInConditionals');
		});
	});

	describe('PreferSafeNavigationOperator', () => {
		it('should detect explicit null checks before property access', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/PreferSafeNavigationOperator.xml',
				'tests/fixtures/negative/codestyle/PreferSafeNavigationOperator.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferSafeNavigationOperator'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag code using safe navigation operator', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/PreferSafeNavigationOperator.xml',
				'tests/fixtures/positive/codestyle/PreferSafeNavigationOperator.cls'
			);
			assertNoViolations(violations, 'PreferSafeNavigationOperator');
		});
	});

	describe('PreferNullCoalescingOverTernary', () => {
		it('should detect ternary operators for null checks', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/PreferNullCoalescingOverTernary.xml',
				'tests/fixtures/negative/codestyle/PreferNullCoalescingOverTernary.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferNullCoalescingOverTernary'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag code using null coalescing operator', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/PreferNullCoalescingOverTernary.xml',
				'tests/fixtures/positive/codestyle/PreferNullCoalescingOverTernary.cls'
			);
			assertNoViolations(violations, 'PreferNullCoalescingOverTernary');
		});
	});

	describe('AvoidOneLinerMethods', () => {
		it('should detect one-liner methods with single statement', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/AvoidOneLinerMethods.xml',
				'tests/fixtures/negative/codestyle/AvoidOneLinerMethods.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'AvoidOneLinerMethods')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag abstract, override, interface, or multi-statement methods', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/AvoidOneLinerMethods.xml',
				'tests/fixtures/positive/codestyle/AvoidOneLinerMethods.cls'
			);
			assertNoViolations(violations, 'AvoidOneLinerMethods');
		});
	});

	describe('NoConsecutiveBlankLines', () => {
		it('should detect consecutive blank lines', async () => {
			const { runRegexRule } = require('../helpers/pmd-helper');
			const violations = await runRegexRule(
				'NoConsecutiveBlankLines',
				'tests/fixtures/negative/codestyle/NoConsecutiveBlankLines.cls'
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
				'tests/fixtures/positive/codestyle/NoConsecutiveBlankLines.cls'
			);
			assertNoViolations(violations, 'NoConsecutiveBlankLines');
		});
	});

	describe('ProhibitSuppressWarnings', () => {
		it('should detect @SuppressWarnings annotations and NOPMD comments', async () => {
			const fs = require('fs');
			const path = require('path');
			const { runRegexRule } = require('../helpers/pmd-helper');
			const negativeDir = 'tests/fixtures/negative/codestyle';
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
			const positiveDir = 'tests/fixtures/positive/codestyle';
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
				'tests/fixtures/negative/codestyle/NoLongLines.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'NoLongLines').length
			).toBeGreaterThan(0);
		});

		it('should not flag lines 80 characters or shorter', async () => {
			const { runRegexRule } = require('../helpers/pmd-helper');
			const violations = await runRegexRule(
				'NoLongLines',
				'tests/fixtures/positive/codestyle/NoLongLines.cls'
			);
			assertNoViolations(violations, 'NoLongLines');
		});
	});

	describe('NoMethodCallsAsArguments', () => {
		it('should detect method calls used directly as arguments', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/NoMethodCallsAsArguments.xml',
				'tests/fixtures/negative/codestyle/NoMethodCallsAsArguments.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'NoMethodCallsAsArguments')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag method calls extracted to variables', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/NoMethodCallsAsArguments.xml',
				'tests/fixtures/positive/codestyle/NoMethodCallsAsArguments.cls'
			);
			assertNoViolations(violations, 'NoMethodCallsAsArguments');
		});
	});

	describe('SingleArgumentMustBeSingleLine', () => {
		it('should detect single-argument method calls on multiple lines', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/SingleArgumentMustBeSingleLine.xml',
				'tests/fixtures/negative/codestyle/SingleArgumentMustBeSingleLine.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'SingleArgumentMustBeSingleLine'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag single-argument method calls on one line', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/SingleArgumentMustBeSingleLine.xml',
				'tests/fixtures/positive/codestyle/SingleArgumentMustBeSingleLine.cls'
			);
			assertNoViolations(violations, 'SingleArgumentMustBeSingleLine');
		});
	});

	describe('PreferStringJoinOverConcatenation', () => {
		it('should detect multiple string concatenations with common separator', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/PreferStringJoinOverConcatenation.xml',
				'tests/fixtures/negative/codestyle/PreferStringJoinOverConcatenation.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferStringJoinOverConcatenation'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag String.join usage or concatenations without common separator', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/PreferStringJoinOverConcatenation.xml',
				'tests/fixtures/positive/codestyle/PreferStringJoinOverConcatenation.cls'
			);
			assertNoViolations(violations, 'PreferStringJoinOverConcatenation');
		});
	});

	describe('MultipleStringContainsCalls', () => {
		it('should detect multiple contains() calls in conditionals', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/MultipleStringContainsCalls.xml',
				'tests/fixtures/negative/codestyle/MultipleStringContainsCalls.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'MultipleStringContainsCalls'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag single contains() calls or regex patterns', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/MultipleStringContainsCalls.xml',
				'tests/fixtures/positive/codestyle/MultipleStringContainsCalls.cls'
			);
			assertNoViolations(violations, 'MultipleStringContainsCalls');
		});
	});

	describe('MapShouldBeInitializedWithValues', () => {
		it('should detect empty maps followed immediately by put()', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/MapShouldBeInitializedWithValues.xml',
				'tests/fixtures/negative/codestyle/MapShouldBeInitializedWithValues.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'MapShouldBeInitializedWithValues'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag maps initialized with values or put() called later', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/MapShouldBeInitializedWithValues.xml',
				'tests/fixtures/positive/codestyle/MapShouldBeInitializedWithValues.cls'
			);
			assertNoViolations(violations, 'MapShouldBeInitializedWithValues');
		});
	});

	describe('PreferStringJoinOverMultipleNewlines', () => {
		it('should detect strings with multiple newlines', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/PreferStringJoinOverMultipleNewlines.xml',
				'tests/fixtures/negative/codestyle/PreferStringJoinOverMultipleNewlines.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferStringJoinOverMultipleNewlines'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag String.join usage or strings with single/no newlines', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/PreferStringJoinOverMultipleNewlines.xml',
				'tests/fixtures/positive/codestyle/PreferStringJoinOverMultipleNewlines.cls'
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
				'rulesets/codestyle/PreferConcatenationOverStringJoinWithEmpty.xml',
				'tests/fixtures/negative/codestyle/PreferConcatenationOverStringJoinWithEmpty.cls'
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
				'rulesets/codestyle/PreferConcatenationOverStringJoinWithEmpty.xml',
				'tests/fixtures/positive/codestyle/PreferConcatenationOverStringJoinWithEmpty.cls'
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
				'rulesets/codestyle/PreferMethodCallsInLoopConditions.xml',
				'tests/fixtures/negative/codestyle/PreferMethodCallsInLoopConditions.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferMethodCallsInLoopConditions'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag method calls in loop conditions or breaks without method calls', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/PreferMethodCallsInLoopConditions.xml',
				'tests/fixtures/positive/codestyle/PreferMethodCallsInLoopConditions.cls'
			);
			assertNoViolations(violations, 'PreferMethodCallsInLoopConditions');
		});
	});

	describe('PreferBuilderPatternChaining', () => {
		it('should detect builder pattern with intermediary variable assignments', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/PreferBuilderPatternChaining.xml',
				'tests/fixtures/negative/codestyle/PreferBuilderPatternChaining.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferBuilderPatternChaining'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag method chaining or assignments in constructors', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/PreferBuilderPatternChaining.xml',
				'tests/fixtures/positive/codestyle/PreferBuilderPatternChaining.cls'
			);
			assertNoViolations(violations, 'PreferBuilderPatternChaining');
		});
	});

	describe('PreferStringJoinWithSeparatorOverEmpty', () => {
		it('should detect String.join with empty separator when strings have common suffix', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/PreferStringJoinWithSeparatorOverEmpty.xml',
				'tests/fixtures/negative/codestyle/PreferStringJoinWithSeparatorOverEmpty.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferStringJoinWithSeparatorOverEmpty'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag String.join with separator or without common suffix', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/PreferStringJoinWithSeparatorOverEmpty.xml',
				'tests/fixtures/positive/codestyle/PreferStringJoinWithSeparatorOverEmpty.cls'
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
				'tests/fixtures/negative/codestyle/ProhibitPrettierIgnore.cls'
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
				'tests/fixtures/positive/codestyle/ProhibitPrettierIgnore.cls'
			);
			assertNoViolations(violations, 'ProhibitPrettierIgnore');
		});
	});

	describe('AvoidMagicNumbers', () => {
		it('should detect magic numbers in code', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/AvoidMagicNumbers.xml',
				'tests/fixtures/negative/codestyle/AvoidMagicNumbers.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'AvoidMagicNumbers').length
			).toBeGreaterThan(0);
		});

		it('should detect magic numbers in @IsTest classes with SeeAllData=true', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/AvoidMagicNumbers.xml',
				'tests/fixtures/negative/codestyle/AvoidMagicNumbers_IsTestSeeAllDataTrue.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'AvoidMagicNumbers').length
			).toBeGreaterThan(0);
		});

		it('should detect magic numbers in case insensitive @IsTest annotation with SeeAllData=true', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/AvoidMagicNumbers.xml',
				'tests/fixtures/negative/codestyle/AvoidMagicNumbers_IsTestAnnotationCaseInsensitive.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'AvoidMagicNumbers').length
			).toBeGreaterThan(0);
		});

		it('should not flag safe numbers, array indices, loop conditions, or constants', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/AvoidMagicNumbers.xml',
				'tests/fixtures/positive/codestyle/AvoidMagicNumbers.cls'
			);
			assertNoViolations(violations, 'AvoidMagicNumbers');
		});

		it('should not flag magic numbers in @IsTest classes (SeeAllData defaults to false)', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/AvoidMagicNumbers.xml',
				'tests/fixtures/positive/codestyle/AvoidMagicNumbers_IsTestDefault.cls'
			);
			assertNoViolations(violations, 'AvoidMagicNumbers');
		});

		it('should not flag magic numbers with case insensitive SeeAllData parameter matching', async () => {
			const violations = await runPMD(
				'rulesets/codestyle/AvoidMagicNumbers.xml',
				'tests/fixtures/positive/codestyle/AvoidMagicNumbers_IsTestCaseInsensitive.cls'
			);
			assertNoViolations(violations, 'AvoidMagicNumbers');
		});
	});
});
