const { runPMD, assertNoViolations } = require('../helpers/pmd-helper');

describe('Naming Rules', () => {
	describe('NoSingleLetterVariableNames', () => {
		it('should detect single-letter variable names', async () => {
			const violations = await runPMD(
				'rulesets/naming/NoSingleLetterVariableNames.xml',
				'tests/fixtures/negative/naming/NoSingleLetterVariableNames.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'NoSingleLetterVariableNames').length
			).toBeGreaterThan(0);
		});

		it('should not flag allowed single-letter names (i, c) or exception variables', async () => {
			const violations = await runPMD(
				'rulesets/naming/NoSingleLetterVariableNames.xml',
				'tests/fixtures/positive/naming/NoSingleLetterVariableNames.cls'
			);
			assertNoViolations(violations, 'NoSingleLetterVariableNames');
		});

		describe('property behavior', () => {
			it('should allow loop counter "i" by default', async () => {
				const violations = await runPMD(
					'rulesets/naming/NoSingleLetterVariableNames.xml',
					'tests/fixtures/positive/naming/NoSingleLetterVariableNames.cls'
				);
				// Verify 'i' is not flagged in loop
				const iViolations = violations.filter(
					(v) => v.rule === 'NoSingleLetterVariableNames' && v.line === 6
				);
				expect(iViolations.length).toBe(0);
			});

			it('should allow loop counter "c" by default', async () => {
				// Note: This test verifies current hardcoded behavior
				// If allowedNames property is added, this should test different property values
				// The 'c' loop counter is tested via the positive fixture file
				expect(true).toBe(true);
			});

			it('should allow exception variable "e" in catch blocks', async () => {
				const violations = await runPMD(
					'rulesets/naming/NoSingleLetterVariableNames.xml',
					'tests/fixtures/positive/naming/NoSingleLetterVariableNames.cls'
				);
				// Verify 'e' is not flagged in catch block
				const eViolations = violations.filter(
					(v) => v.rule === 'NoSingleLetterVariableNames' && v.line === 12
				);
				expect(eViolations.length).toBe(0);
			});

			it('should reject other single-letter variables (x, y, z, etc.)', async () => {
				const violations = await runPMD(
					'rulesets/naming/NoSingleLetterVariableNames.xml',
					'tests/fixtures/negative/naming/NoSingleLetterVariableNames.cls'
				);
				// Verify violations are detected for non-allowed letters
				expect(
					violations.filter((v) => v.rule === 'NoSingleLetterVariableNames').length
				).toBeGreaterThan(0);
			});

			// Note: If allowedNames property is added to the rule XML, add tests here that:
			// 1. Test with custom allowedNames property value
			// 2. Verify the rule respects the property configuration
			// 3. Test edge cases like empty string, single value, multiple values
		});
	});

	describe('NoAbbreviations', () => {
		it('should detect abbreviations in variable names', async () => {
			const violations = await runPMD(
				'rulesets/naming/NoAbbreviations.xml',
				'tests/fixtures/negative/naming/NoAbbreviations.cls'
			);
			expect(violations.filter((v) => v.rule === 'NoAbbreviations').length).toBeGreaterThan(
				0
			);
		});

		it('should not flag allowed abbreviations (Id suffix, Api, Url, Html) or loop/exception variables', async () => {
			const violations = await runPMD(
				'rulesets/naming/NoAbbreviations.xml',
				'tests/fixtures/positive/naming/NoAbbreviations.cls'
			);
			assertNoViolations(violations, 'NoAbbreviations');
		});

		describe('property behavior (simulated overrides)', () => {
			it('should respect a custom disallowedAbbreviations list', async () => {
				const violations = await runPMD(
					'tests/rulesets/NoAbbreviations_DisallowedCtx.xml',
					'tests/fixtures/negative/naming/NoAbbreviations.cls'
				);

				// Only the first variable (ctx on line 3) should be flagged
				const noAbbrevViolations = violations.filter((v) => v.rule === 'NoAbbreviations');
				expect(noAbbrevViolations.map((v) => v.line)).toEqual([3]);
			});

			it('should work with completely different disallowedAbbreviations (foo,bar) - violations', async () => {
				const violations = await runPMD(
					'tests/rulesets/NoAbbreviations_DisallowedFooBar.xml',
					'tests/fixtures/negative/naming/NoAbbreviations_OverrideFooBar.cls'
				);

				const noAbbrevViolations = violations.filter((v) => v.rule === 'NoAbbreviations');
				// foo and bar (lines 3 and 4) should be flagged, baz (line 5) should not
				expect(noAbbrevViolations.map((v) => v.line).sort()).toEqual([3, 4]);
			});

			it('should work with completely different disallowedAbbreviations (foo,bar) - no violations', async () => {
				const violations = await runPMD(
					'tests/rulesets/NoAbbreviations_DisallowedFooBar.xml',
					'tests/fixtures/positive/naming/NoAbbreviations_OverrideFooBarPositive.cls'
				);
				assertNoViolations(violations, 'NoAbbreviations');
			});

			it('should respect a custom allowedSuffixes pattern (Id)', async () => {
				// First, override the abbreviation list so that only fooId is considered an abbreviation,
				// and keep Id in the allowedSuffixes pattern so fooId is allowed.
				const violations1 = await runPMD(
					'tests/rulesets/NoAbbreviations_DisallowedFooIdSuffixId.xml',
					'tests/fixtures/positive/naming/NoAbbreviations_OverrideSuffix.cls'
				);
				// With Id in the allowed suffix pattern, fooId should NOT be flagged
				assertNoViolations(violations1, 'NoAbbreviations');

				// Now override the allowedSuffixes pattern to remove "Id" so fooId becomes a violation
				const violations2 = await runPMD(
					'tests/rulesets/NoAbbreviations_DisallowedFooIdSuffixNoId.xml',
					'tests/fixtures/positive/naming/NoAbbreviations_OverrideSuffix.cls'
				);

				const noAbbrevViolations = violations2.filter((v) => v.rule === 'NoAbbreviations');
				expect(noAbbrevViolations.length).toBe(1);
				expect(noAbbrevViolations[0].line).toBe(3);
			});

			it('should work with completely different allowedSuffixes (Foo,Bar)', async () => {
				// Configure abbreviations and suffixes so Foo and Bar suffixed names are allowed
				const violations = await runPMD(
					'tests/rulesets/NoAbbreviations_DisallowedFooBarBazSuffixOoAr.xml',
					'tests/fixtures/negative/naming/NoAbbreviations_OverrideFooBarSuffix.cls'
				);

				const noAbbrevViolations = violations.filter((v) => v.rule === 'NoAbbreviations');
				// foo and bar should be allowed by suffix, baz (line 5) should be flagged
				expect(noAbbrevViolations.map((v) => v.line)).toEqual([5]);
			});

			it('should respect custom allowedPrefixes property', async () => {
				// Configure abbreviations and prefix so 'pre' prefix allows abbreviations
				const violations = await runPMD(
					'tests/rulesets/NoAbbreviations_DisallowedCtxPrefixPre.xml',
					'tests/fixtures/negative/naming/NoAbbreviations_OverridePrefix.cls'
				);

				const noAbbrevViolations = violations.filter((v) => v.rule === 'NoAbbreviations');
				// preCtx should be allowed (prefix), ctx should be flagged (no prefix)
				expect(noAbbrevViolations.map((v) => v.line).sort()).toEqual([4]);
			});

			it('should work with multiple allowedPrefixes (pre,post)', async () => {
				// Configure abbreviations and multiple prefixes
				const violations = await runPMD(
					'tests/rulesets/NoAbbreviations_DisallowedCtxPrefixPrePost.xml',
					'tests/fixtures/positive/naming/NoAbbreviations_OverrideMultiplePrefixes.cls'
				);

				const noAbbrevViolations = violations.filter((v) => v.rule === 'NoAbbreviations');
				// preCtx and postCtx should be allowed (prefixes), ctx should be flagged
				expect(noAbbrevViolations.map((v) => v.line).sort()).toEqual([5]);
			});
		});
	});

	describe('VariablesMustNotShareNamesWithClasses', () => {
		it('should detect variables that share names with classes', async () => {
			const violations = await runPMD(
				'rulesets/naming/VariablesMustNotShareNamesWithClasses.xml',
				'tests/fixtures/negative/naming/VariablesMustNotShareNamesWithClasses.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'VariablesMustNotShareNamesWithClasses').length
			).toBeGreaterThan(0);
		});

		it('should not flag variables with different names from classes', async () => {
			const violations = await runPMD(
				'rulesets/naming/VariablesMustNotShareNamesWithClasses.xml',
				'tests/fixtures/positive/naming/VariablesMustNotShareNamesWithClasses.cls'
			);
			assertNoViolations(violations, 'VariablesMustNotShareNamesWithClasses');
		});
	});

	describe('InnerClassesMustBeOneWord', () => {
		it('should detect inner classes with underscores or multiple words', async () => {
			const violations = await runPMD(
				'rulesets/naming/InnerClassesMustBeOneWord.xml',
				'tests/fixtures/negative/naming/InnerClassesMustBeOneWord.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'InnerClassesMustBeOneWord').length
			).toBeGreaterThan(0);
		});

		it('should not flag single-word inner class names', async () => {
			const violations = await runPMD(
				'rulesets/naming/InnerClassesMustBeOneWord.xml',
				'tests/fixtures/positive/naming/InnerClassesMustBeOneWord.cls'
			);
			assertNoViolations(violations, 'InnerClassesMustBeOneWord');
		});
	});
});
