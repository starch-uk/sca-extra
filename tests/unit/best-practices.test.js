const { runPMD, assertNoViolations } = require('../helpers/pmd-helper');

describe('Best Practices Rules - Modifiers', () => {
	describe('FinalVariablesMustBeFinal', () => {
		it('should detect variables that should be final', async () => {
			const violations = await runPMD(
				'rulesets/best-practices/FinalVariablesMustBeFinal.xml',
				'tests/fixtures/negative/best-practices/FinalVariablesMustBeFinal.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'FinalVariablesMustBeFinal')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag variables that are reassigned or already final', async () => {
			const violations = await runPMD(
				'rulesets/best-practices/FinalVariablesMustBeFinal.xml',
				'tests/fixtures/positive/best-practices/FinalVariablesMustBeFinal.cls'
			);
			assertNoViolations(violations, 'FinalVariablesMustBeFinal');
		});
	});

	describe('StaticMethodsMustBeStatic', () => {
		it('should detect methods that should be static', async () => {
			const violations = await runPMD(
				'rulesets/best-practices/StaticMethodsMustBeStatic.xml',
				'tests/fixtures/negative/best-practices/StaticMethodsMustBeStatic.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'StaticMethodsMustBeStatic')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag methods that use instance state or are already static', async () => {
			const violations = await runPMD(
				'rulesets/best-practices/StaticMethodsMustBeStatic.xml',
				'tests/fixtures/positive/best-practices/StaticMethodsMustBeStatic.cls'
			);
			assertNoViolations(violations, 'StaticMethodsMustBeStatic');
		});
	});

	describe('RegexPatternsMustBeStaticFinal', () => {
		it('should detect inline regex patterns', async () => {
			const violations = await runPMD(
				'rulesets/best-practices/RegexPatternsMustBeStaticFinal.xml',
				'tests/fixtures/negative/best-practices/RegexPatternsMustBeStaticFinal.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'RegexPatternsMustBeStaticFinal'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag static final regex patterns', async () => {
			const violations = await runPMD(
				'rulesets/best-practices/RegexPatternsMustBeStaticFinal.xml',
				'tests/fixtures/positive/best-practices/RegexPatternsMustBeStaticFinal.cls'
			);
			assertNoViolations(violations, 'RegexPatternsMustBeStaticFinal');
		});
	});

	describe('StaticVariablesMustBeFinalAndScreamingSnakeCase', () => {
		it('should detect static variables that are not final or not SCREAMING_SNAKE_CASE', async () => {
			const violations = await runPMD(
				'rulesets/best-practices/StaticVariablesMustBeFinalAndScreamingSnakeCase.xml',
				'tests/fixtures/negative/best-practices/StaticVariablesMustBeFinalAndScreamingSnakeCase.cls'
			);
			expect(
				violations.filter(
					(v) =>
						v.rule ===
						'StaticVariablesMustBeFinalAndScreamingSnakeCase'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag static final variables in SCREAMING_SNAKE_CASE', async () => {
			const violations = await runPMD(
				'rulesets/best-practices/StaticVariablesMustBeFinalAndScreamingSnakeCase.xml',
				'tests/fixtures/positive/best-practices/StaticVariablesMustBeFinalAndScreamingSnakeCase.cls'
			);
			assertNoViolations(
				violations,
				'StaticVariablesMustBeFinalAndScreamingSnakeCase'
			);
		});
	});

	describe('TestClassIsParallel', () => {
		it('should detect test classes without IsParallel=true', async () => {
			const violations = await runPMD(
				'rulesets/best-practices/TestClassIsParallel.xml',
				'tests/fixtures/negative/best-practices/TestClassIsParallel.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'TestClassIsParallel')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag test classes with IsParallel=true', async () => {
			const violations = await runPMD(
				'rulesets/best-practices/TestClassIsParallel.xml',
				'tests/fixtures/positive/best-practices/TestClassIsParallel.cls'
			);
			assertNoViolations(violations, 'TestClassIsParallel');
		});
	});
});
