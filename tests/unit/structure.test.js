const { runPMD, assertViolation, assertNoViolations } = require("../helpers/pmd-helper");

describe("Structure Rules", () => {
  describe("ProhibitSuppressWarnings", () => {
    it("should detect @SuppressWarnings annotation", async () => {
      const violations = await runPMD(
        "rulesets/structure/ProhibitSuppressWarnings.xml",
        "tests/fixtures/negative/structure/ProhibitSuppressWarnings.cls"
      );
      assertViolation(violations, "ProhibitSuppressWarnings", 5);
    });

    it("should not flag code without @SuppressWarnings", async () => {
      const violations = await runPMD(
        "rulesets/structure/ProhibitSuppressWarnings.xml",
        "tests/fixtures/positive/structure/ProhibitSuppressWarnings.cls"
      );
      assertNoViolations(violations, "ProhibitSuppressWarnings");
    });
  });

  describe("InnerClassesCannotBeStatic", () => {
    it("should detect static inner classes", async () => {
      const violations = await runPMD(
        "rulesets/structure/InnerClassesCannotBeStatic.xml",
        "tests/fixtures/negative/structure/InnerClassesCannotBeStatic.cls"
      );
      assertViolation(violations, "InnerClassesCannotBeStatic", 3);
    });

    it("should not flag non-static inner classes", async () => {
      const violations = await runPMD(
        "rulesets/structure/InnerClassesCannotBeStatic.xml",
        "tests/fixtures/positive/structure/InnerClassesCannotBeStatic.cls"
      );
      assertNoViolations(violations, "InnerClassesCannotBeStatic");
    });
  });

  describe("InnerClassesCannotHaveStaticMembers", () => {
    it("should detect static members in inner classes", async () => {
      const violations = await runPMD(
        "rulesets/structure/InnerClassesCannotHaveStaticMembers.xml",
        "tests/fixtures/negative/structure/InnerClassesCannotHaveStaticMembers.cls"
      );
      // Should detect both static field and static method
      expect(
        violations.filter((v) => v.rule === "InnerClassesCannotHaveStaticMembers").length
      ).toBeGreaterThan(0);
    });

    it("should not flag non-static members in inner classes", async () => {
      const violations = await runPMD(
        "rulesets/structure/InnerClassesCannotHaveStaticMembers.xml",
        "tests/fixtures/positive/structure/InnerClassesCannotHaveStaticMembers.cls"
      );
      assertNoViolations(violations, "InnerClassesCannotHaveStaticMembers");
    });
  });

  describe("ClassesMustHaveMethods", () => {
    it("should detect classes with only fields and constructors", async () => {
      const violations = await runPMD(
        "rulesets/structure/ClassesMustHaveMethods.xml",
        "tests/fixtures/negative/structure/ClassesMustHaveMethods.cls"
      );
      expect(violations.filter((v) => v.rule === "ClassesMustHaveMethods").length).toBeGreaterThan(
        0
      );
    });

    it("should not flag classes with instance methods", async () => {
      const violations = await runPMD(
        "rulesets/structure/ClassesMustHaveMethods.xml",
        "tests/fixtures/positive/structure/ClassesMustHaveMethods.cls"
      );
      assertNoViolations(violations, "ClassesMustHaveMethods");
    });
  });

  describe("AvoidTrivialPropertyGetters", () => {
    it("should detect trivial getters that only return fields", async () => {
      const violations = await runPMD(
        "rulesets/structure/AvoidTrivialPropertyGetters.xml",
        "tests/fixtures/negative/structure/AvoidTrivialPropertyGetters.cls"
      );
      expect(
        violations.filter((v) => v.rule === "AvoidTrivialPropertyGetters").length
      ).toBeGreaterThan(0);
    });

    it("should not flag getters with logic or auto-properties", async () => {
      const violations = await runPMD(
        "rulesets/structure/AvoidTrivialPropertyGetters.xml",
        "tests/fixtures/positive/structure/AvoidTrivialPropertyGetters.cls"
      );
      assertNoViolations(violations, "AvoidTrivialPropertyGetters");
    });
  });

  describe("AvoidLowValueWrapperMethods", () => {
    it("should detect methods that only wrap instanceof checks", async () => {
      const violations = await runPMD(
        "rulesets/structure/AvoidLowValueWrapperMethods.xml",
        "tests/fixtures/negative/structure/AvoidLowValueWrapperMethods.cls"
      );
      expect(
        violations.filter((v) => v.rule === "AvoidLowValueWrapperMethods").length
      ).toBeGreaterThan(0);
    });

    it("should not flag methods with additional logic", async () => {
      const violations = await runPMD(
        "rulesets/structure/AvoidLowValueWrapperMethods.xml",
        "tests/fixtures/positive/structure/AvoidLowValueWrapperMethods.cls"
      );
      assertNoViolations(violations, "AvoidLowValueWrapperMethods");
    });
  });

  describe("NoParameterClasses", () => {
    it("should detect classes with only fields and constructors", async () => {
      const violations = await runPMD(
        "rulesets/structure/NoParameterClasses.xml",
        "tests/fixtures/negative/structure/NoParameterClasses.cls"
      );
      expect(violations.filter((v) => v.rule === "NoParameterClasses").length).toBeGreaterThan(0);
    });

    it("should not flag classes with instance methods", async () => {
      const violations = await runPMD(
        "rulesets/structure/NoParameterClasses.xml",
        "tests/fixtures/positive/structure/NoParameterClasses.cls"
      );
      assertNoViolations(violations, "NoParameterClasses");
    });
  });

  describe("NoThisOutsideConstructors", () => {
    it("should detect use of this. outside constructors", async () => {
      const violations = await runPMD(
        "rulesets/structure/NoThisOutsideConstructors.xml",
        "tests/fixtures/negative/structure/NoThisOutsideConstructors.cls"
      );
      expect(
        violations.filter((v) => v.rule === "NoThisOutsideConstructors").length
      ).toBeGreaterThan(0);
    });

    it("should not flag use of this. in constructors or returning this", async () => {
      const violations = await runPMD(
        "rulesets/structure/NoThisOutsideConstructors.xml",
        "tests/fixtures/positive/structure/NoThisOutsideConstructors.cls"
      );
      assertNoViolations(violations, "NoThisOutsideConstructors");
    });
  });

  describe("EnumMinimumValues", () => {
    it("should detect enums with fewer than 3 values", async () => {
      const violations = await runPMD(
        "rulesets/structure/EnumMinimumValues.xml",
        "tests/fixtures/negative/structure/EnumMinimumValues.cls"
      );
      expect(violations.filter((v) => v.rule === "EnumMinimumValues").length).toBeGreaterThan(0);
    });

    it("should not flag enums with 3 or more values", async () => {
      const violations = await runPMD(
        "rulesets/structure/EnumMinimumValues.xml",
        "tests/fixtures/positive/structure/EnumMinimumValues.cls"
      );
      assertNoViolations(violations, "EnumMinimumValues");
    });
  });

  describe("CombineNestedIfStatements", () => {
    it("should detect nested if statements that can be combined", async () => {
      const violations = await runPMD(
        "rulesets/structure/CombineNestedIfStatements.xml",
        "tests/fixtures/negative/structure/CombineNestedIfStatements.cls"
      );
      expect(
        violations.filter((v) => v.rule === "CombineNestedIfStatements").length
      ).toBeGreaterThan(0);
    });

    it("should not flag combined if statements or nested ifs with else/multiple statements", async () => {
      const violations = await runPMD(
        "rulesets/structure/CombineNestedIfStatements.xml",
        "tests/fixtures/positive/structure/CombineNestedIfStatements.cls"
      );
      assertNoViolations(violations, "CombineNestedIfStatements");
    });
  });

  describe("NoUnnecessaryAttributeVariables", () => {
    it("should detect variables for attributes used only once", async () => {
      const violations = await runPMD(
        "rulesets/structure/NoUnnecessaryAttributeVariables.xml",
        "tests/fixtures/negative/structure/NoUnnecessaryAttributeVariables.cls"
      );
      expect(
        violations.filter((v) => v.rule === "NoUnnecessaryAttributeVariables").length
      ).toBeGreaterThan(0);
    });

    it("should not flag variables used multiple times, reassigned, or collections/objects", async () => {
      const violations = await runPMD(
        "rulesets/structure/NoUnnecessaryAttributeVariables.xml",
        "tests/fixtures/positive/structure/NoUnnecessaryAttributeVariables.cls"
      );
      assertNoViolations(violations, "NoUnnecessaryAttributeVariables");
    });
  });

  describe("NoUnnecessaryReturnVariables", () => {
    it("should detect variables created immediately before return", async () => {
      const violations = await runPMD(
        "rulesets/structure/NoUnnecessaryReturnVariables.xml",
        "tests/fixtures/negative/structure/NoUnnecessaryReturnVariables.cls"
      );
      expect(
        violations.filter((v) => v.rule === "NoUnnecessaryReturnVariables").length
      ).toBeGreaterThan(0);
    });

    it("should not flag variables used or modified before return", async () => {
      const violations = await runPMD(
        "rulesets/structure/NoUnnecessaryReturnVariables.xml",
        "tests/fixtures/positive/structure/NoUnnecessaryReturnVariables.cls"
      );
      assertNoViolations(violations, "NoUnnecessaryReturnVariables");
    });
  });

  describe("PreferSwitchOverIfElseChains", () => {
    it("should detect if-else chains with 3+ conditions", async () => {
      const violations = await runPMD(
        "rulesets/structure/PreferSwitchOverIfElseChains.xml",
        "tests/fixtures/negative/structure/PreferSwitchOverIfElseChains.cls"
      );
      expect(
        violations.filter((v) => v.rule === "PreferSwitchOverIfElseChains").length
      ).toBeGreaterThan(0);
    });

    it("should not flag switch statements or if-else with fewer conditions", async () => {
      const violations = await runPMD(
        "rulesets/structure/PreferSwitchOverIfElseChains.xml",
        "tests/fixtures/positive/structure/PreferSwitchOverIfElseChains.cls"
      );
      assertNoViolations(violations, "PreferSwitchOverIfElseChains");
    });
  });

  describe("PreferPropertySyntaxOverGetterMethods", () => {
    it("should detect public getters for private fields", async () => {
      const violations = await runPMD(
        "rulesets/structure/PreferPropertySyntaxOverGetterMethods.xml",
        "tests/fixtures/negative/structure/PreferPropertySyntaxOverGetterMethods.cls"
      );
      expect(
        violations.filter((v) => v.rule === "PreferPropertySyntaxOverGetterMethods").length
      ).toBeGreaterThan(0);
    });

    it("should not flag property syntax or getters with logic", async () => {
      const violations = await runPMD(
        "rulesets/structure/PreferPropertySyntaxOverGetterMethods.xml",
        "tests/fixtures/positive/structure/PreferPropertySyntaxOverGetterMethods.cls"
      );
      assertNoViolations(violations, "PreferPropertySyntaxOverGetterMethods");
    });
  });
});
