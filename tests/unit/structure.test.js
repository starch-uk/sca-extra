const {
	runPMD,
	assertViolation,
	assertNoViolations,
} = require('../helpers/pmd-helper');

describe('Design Rules - Structure', () => {
	describe('InnerClassesCannotBeStatic', () => {
		it('should detect static inner classes', async () => {
			const violations = await runPMD(
				'rulesets/design/InnerClassesCannotBeStatic.xml',
				'tests/fixtures/negative/design/InnerClassesCannotBeStatic.cls'
			);
			assertViolation(violations, 'InnerClassesCannotBeStatic', 2);
		});

		it('should not flag non-static inner classes', async () => {
			const violations = await runPMD(
				'rulesets/design/InnerClassesCannotBeStatic.xml',
				'tests/fixtures/positive/design/InnerClassesCannotBeStatic.cls'
			);
			assertNoViolations(violations, 'InnerClassesCannotBeStatic');
		});
	});

	describe('InnerClassesCannotHaveStaticMembers', () => {
		it('should detect static members in inner classes', async () => {
			const violations = await runPMD(
				'rulesets/design/InnerClassesCannotHaveStaticMembers.xml',
				'tests/fixtures/negative/design/InnerClassesCannotHaveStaticMembers.cls'
			);
			// Should detect both static field and static method
			expect(
				violations.filter(
					(v) => v.rule === 'InnerClassesCannotHaveStaticMembers'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag non-static members in inner classes', async () => {
			const violations = await runPMD(
				'rulesets/design/InnerClassesCannotHaveStaticMembers.xml',
				'tests/fixtures/positive/design/InnerClassesCannotHaveStaticMembers.cls'
			);
			assertNoViolations(
				violations,
				'InnerClassesCannotHaveStaticMembers'
			);
		});
	});

	describe('ClassesMustHaveMethods', () => {
		it('should detect classes with only fields and constructors', async () => {
			const violations = await runPMD(
				'rulesets/design/ClassesMustHaveMethods.xml',
				'tests/fixtures/negative/design/ClassesMustHaveMethods.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'ClassesMustHaveMethods')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag classes with instance methods', async () => {
			const violations = await runPMD(
				'rulesets/design/ClassesMustHaveMethods.xml',
				'tests/fixtures/positive/design/ClassesMustHaveMethods.cls'
			);
			assertNoViolations(violations, 'ClassesMustHaveMethods');
		});
	});

	describe('AvoidTrivialPropertyGetters', () => {
		it('should detect trivial getters that only return fields', async () => {
			const violations = await runPMD(
				'rulesets/design/AvoidTrivialPropertyGetters.xml',
				'tests/fixtures/negative/design/AvoidTrivialPropertyGetters.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'AvoidTrivialPropertyGetters'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag getters with logic or auto-properties', async () => {
			const violations = await runPMD(
				'rulesets/design/AvoidTrivialPropertyGetters.xml',
				'tests/fixtures/positive/design/AvoidTrivialPropertyGetters.cls'
			);
			assertNoViolations(violations, 'AvoidTrivialPropertyGetters');
		});
	});

	describe('AvoidLowValueWrapperMethods', () => {
		it('should detect methods that only wrap instanceof checks', async () => {
			const violations = await runPMD(
				'rulesets/design/AvoidLowValueWrapperMethods.xml',
				'tests/fixtures/negative/design/AvoidLowValueWrapperMethods.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'AvoidLowValueWrapperMethods'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag methods with additional logic', async () => {
			const violations = await runPMD(
				'rulesets/design/AvoidLowValueWrapperMethods.xml',
				'tests/fixtures/positive/design/AvoidLowValueWrapperMethods.cls'
			);
			assertNoViolations(violations, 'AvoidLowValueWrapperMethods');
		});
	});

	describe('NoParameterClasses', () => {
		it('should detect classes with only fields and constructors', async () => {
			const violations = await runPMD(
				'rulesets/design/NoParameterClasses.xml',
				'tests/fixtures/negative/design/NoParameterClasses.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'NoParameterClasses').length
			).toBeGreaterThan(0);
		});

		it('should not flag classes with instance methods', async () => {
			const violations = await runPMD(
				'rulesets/design/NoParameterClasses.xml',
				'tests/fixtures/positive/design/NoParameterClasses.cls'
			);
			assertNoViolations(violations, 'NoParameterClasses');
		});
	});

	describe('NoThisOutsideConstructors', () => {
		it('should detect use of this. outside constructors', async () => {
			const violations = await runPMD(
				'rulesets/design/NoThisOutsideConstructors.xml',
				'tests/fixtures/negative/design/NoThisOutsideConstructors.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'NoThisOutsideConstructors')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag use of this. in constructors or returning this', async () => {
			const violations = await runPMD(
				'rulesets/design/NoThisOutsideConstructors.xml',
				'tests/fixtures/positive/design/NoThisOutsideConstructors.cls'
			);
			assertNoViolations(violations, 'NoThisOutsideConstructors');
		});
	});

	describe('EnumMinimumValues', () => {
		it('should detect enums with fewer than 3 values', async () => {
			const violations = await runPMD(
				'rulesets/design/EnumMinimumValues.xml',
				'tests/fixtures/negative/design/EnumMinimumValues.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'EnumMinimumValues').length
			).toBeGreaterThan(0);
		});

		it('should not flag enums with 3 or more values', async () => {
			const violations = await runPMD(
				'rulesets/design/EnumMinimumValues.xml',
				'tests/fixtures/positive/design/EnumMinimumValues.cls'
			);
			assertNoViolations(violations, 'EnumMinimumValues');
		});
	});

	describe('CombineNestedIfStatements', () => {
		it('should detect nested if statements that can be combined', async () => {
			const violations = await runPMD(
				'rulesets/design/CombineNestedIfStatements.xml',
				'tests/fixtures/negative/design/CombineNestedIfStatements.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'CombineNestedIfStatements')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag combined if statements or nested ifs with else/multiple statements', async () => {
			const violations = await runPMD(
				'rulesets/design/CombineNestedIfStatements.xml',
				'tests/fixtures/positive/design/CombineNestedIfStatements.cls'
			);
			assertNoViolations(violations, 'CombineNestedIfStatements');
		});
	});

	describe('NoUnnecessaryAttributeVariables', () => {
		it('should detect variables for attributes used only once', async () => {
			const violations = await runPMD(
				'rulesets/design/NoUnnecessaryAttributeVariables.xml',
				'tests/fixtures/negative/design/NoUnnecessaryAttributeVariables.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'NoUnnecessaryAttributeVariables'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag variables used multiple times, reassigned, or collections/objects', async () => {
			const violations = await runPMD(
				'rulesets/design/NoUnnecessaryAttributeVariables.xml',
				'tests/fixtures/positive/design/NoUnnecessaryAttributeVariables.cls'
			);
			assertNoViolations(violations, 'NoUnnecessaryAttributeVariables');
		});
	});

	describe('NoUnnecessaryReturnVariables', () => {
		it('should detect variables created immediately before return', async () => {
			const violations = await runPMD(
				'rulesets/design/NoUnnecessaryReturnVariables.xml',
				'tests/fixtures/negative/design/NoUnnecessaryReturnVariables.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'NoUnnecessaryReturnVariables'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag variables used or modified before return', async () => {
			const violations = await runPMD(
				'rulesets/design/NoUnnecessaryReturnVariables.xml',
				'tests/fixtures/positive/design/NoUnnecessaryReturnVariables.cls'
			);
			assertNoViolations(violations, 'NoUnnecessaryReturnVariables');
		});
	});

	describe('PreferSwitchOverIfElseChains', () => {
		it('should detect if-else chains with 2+ conditions comparing the same variable', async () => {
			const violations = await runPMD(
				'rulesets/design/PreferSwitchOverIfElseChains.xml',
				'tests/fixtures/negative/design/PreferSwitchOverIfElseChains.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferSwitchOverIfElseChains'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag switch statements, single conditions, or chains comparing different variables', async () => {
			const violations = await runPMD(
				'rulesets/design/PreferSwitchOverIfElseChains.xml',
				'tests/fixtures/positive/design/PreferSwitchOverIfElseChains.cls'
			);
			assertNoViolations(violations, 'PreferSwitchOverIfElseChains');
		});

		it('should detect violations for all switch-compatible types (String, Integer, Long, Enum, SObjectType, SObject instances)', async () => {
			const violations = await runPMD(
				'rulesets/design/PreferSwitchOverIfElseChains.xml',
				'tests/fixtures/negative/design/PreferSwitchOverIfElseChains_SwitchTypes.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferSwitchOverIfElseChains'
				).length
			).toBeGreaterThan(0);
		});

		it('should detect instanceof patterns with SObject instances', async () => {
			const violations = await runPMD(
				'rulesets/design/PreferSwitchOverIfElseChains.xml',
				'tests/fixtures/negative/design/PreferSwitchOverIfElseChains_Instanceof.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferSwitchOverIfElseChains'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag non-switch-compatible types (Boolean, Decimal, Double, Date, DateTime, Time, Id, Blob)', async () => {
			const violations = await runPMD(
				'rulesets/design/PreferSwitchOverIfElseChains.xml',
				'tests/fixtures/positive/design/PreferSwitchOverIfElseChains_NonSwitchTypes.cls'
			);
			assertNoViolations(violations, 'PreferSwitchOverIfElseChains');
		});

		describe('OR conditions', () => {
			it('should not flag OR condition with different variables', async () => {
				const violations = await runPMD(
					'rulesets/design/PreferSwitchOverIfElseChains.xml',
					'tests/fixtures/positive/design/PreferSwitchOverIfElseChains_ORDifferentVars.cls'
				);
				assertNoViolations(violations, 'PreferSwitchOverIfElseChains');
			});
		});

		describe('mixed patterns', () => {
			it('should detect mixed if-else chain followed by consecutive if statements', async () => {
				const violations = await runPMD(
					'rulesets/design/PreferSwitchOverIfElseChains.xml',
					'tests/fixtures/negative/design/PreferSwitchOverIfElseChains_Mixed.cls'
				);
				// Should detect both the if-else chain and the consecutive if statements
				expect(
					violations.filter(
						(v) => v.rule === 'PreferSwitchOverIfElseChains'
					).length
				).toBeGreaterThan(0);
			});
		});
	});

	describe('PreferPropertySyntaxOverGetterMethods', () => {
		it('should detect public getters for private fields', async () => {
			const violations = await runPMD(
				'rulesets/design/PreferPropertySyntaxOverGetterMethods.xml',
				'tests/fixtures/negative/design/PreferPropertySyntaxOverGetterMethods.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'PreferPropertySyntaxOverGetterMethods'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag property syntax or getters with logic', async () => {
			const violations = await runPMD(
				'rulesets/design/PreferPropertySyntaxOverGetterMethods.xml',
				'tests/fixtures/positive/design/PreferPropertySyntaxOverGetterMethods.cls'
			);
			assertNoViolations(
				violations,
				'PreferPropertySyntaxOverGetterMethods'
			);
		});
	});

	describe('NoCustomParameterObjects', () => {
		it('should detect inner classes with only fields and no methods', async () => {
			const violations = await runPMD(
				'rulesets/design/NoCustomParameterObjects.xml',
				'tests/fixtures/negative/design/NoCustomParameterObjects.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'NoCustomParameterObjects')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag inner classes with methods or InvocableVariable annotations', async () => {
			const violations = await runPMD(
				'rulesets/design/NoCustomParameterObjects.xml',
				'tests/fixtures/positive/design/NoCustomParameterObjects.cls'
			);
			assertNoViolations(violations, 'NoCustomParameterObjects');
		});
	});

	describe('SingleParameterMustBeSingleLine', () => {
		it('should detect methods with 0-1 parameters on multiple lines', async () => {
			const violations = await runPMD(
				'rulesets/design/SingleParameterMustBeSingleLine.xml',
				'tests/fixtures/negative/design/SingleParameterMustBeSingleLine.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'SingleParameterMustBeSingleLine'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag methods with 0-1 parameters on one line', async () => {
			const violations = await runPMD(
				'rulesets/design/SingleParameterMustBeSingleLine.xml',
				'tests/fixtures/positive/design/SingleParameterMustBeSingleLine.cls'
			);
			assertNoViolations(violations, 'SingleParameterMustBeSingleLine');
		});
	});
});
