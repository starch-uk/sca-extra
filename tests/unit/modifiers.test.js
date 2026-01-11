const { runPMD, assertNoViolations } = require('../helpers/pmd-helper');

describe('Best Practices Rules - Modifiers', () => {
	describe('FinalVariablesMustBeFinal', () => {
		it('should detect variables that should be final', async () => {
			const violations = await runPMD(
				'rulesets/bestpractices/FinalVariablesMustBeFinal.xml',
				'tests/fixtures/negative/bestpractices/FinalVariablesMustBeFinal.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'FinalVariablesMustBeFinal')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag variables that are reassigned or already final', async () => {
			const violations = await runPMD(
				'rulesets/bestpractices/FinalVariablesMustBeFinal.xml',
				'tests/fixtures/positive/bestpractices/FinalVariablesMustBeFinal.cls'
			);
			assertNoViolations(violations, 'FinalVariablesMustBeFinal');
		});
	});

	describe('StaticMethodsMustBeStatic', () => {
		it('should detect methods that should be static', async () => {
			const violations = await runPMD(
				'rulesets/bestpractices/StaticMethodsMustBeStatic.xml',
				'tests/fixtures/negative/bestpractices/StaticMethodsMustBeStatic.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'StaticMethodsMustBeStatic')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag methods that use instance state or are already static', async () => {
			const violations = await runPMD(
				'rulesets/bestpractices/StaticMethodsMustBeStatic.xml',
				'tests/fixtures/positive/bestpractices/StaticMethodsMustBeStatic.cls'
			);
			assertNoViolations(violations, 'StaticMethodsMustBeStatic');
		});
	});

	describe('RegexPatternsMustBeStaticFinal', () => {
		it('should detect inline regex patterns', async () => {
			const violations = await runPMD(
				'rulesets/bestpractices/RegexPatternsMustBeStaticFinal.xml',
				'tests/fixtures/negative/bestpractices/RegexPatternsMustBeStaticFinal.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'RegexPatternsMustBeStaticFinal'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag static final regex patterns', async () => {
			const violations = await runPMD(
				'rulesets/bestpractices/RegexPatternsMustBeStaticFinal.xml',
				'tests/fixtures/positive/bestpractices/RegexPatternsMustBeStaticFinal.cls'
			);
			assertNoViolations(violations, 'RegexPatternsMustBeStaticFinal');
		});
	});

	describe('StaticVariablesMustBeFinalAndScreamingSnakeCase', () => {
		it('should detect static variables that are not final or not SCREAMING_SNAKE_CASE', async () => {
			const violations = await runPMD(
				'rulesets/bestpractices/StaticVariablesMustBeFinalAndScreamingSnakeCase.xml',
				'tests/fixtures/negative/bestpractices/StaticVariablesMustBeFinalAndScreamingSnakeCase.cls'
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
				'rulesets/bestpractices/StaticVariablesMustBeFinalAndScreamingSnakeCase.xml',
				'tests/fixtures/positive/bestpractices/StaticVariablesMustBeFinalAndScreamingSnakeCase.cls'
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
				'rulesets/bestpractices/TestClassIsParallel.xml',
				'tests/fixtures/negative/bestpractices/TestClassIsParallel.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'TestClassIsParallel')
					.length
			).toBeGreaterThan(0);
		});

		it('should detect test classes without IsParallel=true that do not use restricted operations', async () => {
			const violations = await runPMD(
				'rulesets/bestpractices/TestClassIsParallel.xml',
				'tests/fixtures/negative/bestpractices/TestClassIsParallelRestrictions.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'TestClassIsParallel')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag test classes with IsParallel=true', async () => {
			const violations = await runPMD(
				'rulesets/bestpractices/TestClassIsParallel.xml',
				'tests/fixtures/positive/bestpractices/TestClassIsParallel.cls'
			);
			assertNoViolations(violations, 'TestClassIsParallel');
		});

		it('should not flag test classes without IsParallel=true that use restricted operations', async () => {
			const violations = await runPMD(
				'rulesets/bestpractices/TestClassIsParallel.xml',
				'tests/fixtures/positive/bestpractices/TestClassIsParallelRestrictions.cls'
			);
			assertNoViolations(violations, 'TestClassIsParallel');
		});
	});
});
