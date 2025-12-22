const { runPMD, assertNoViolations } = require("../helpers/pmd-helper");

describe("Modifier Rules", () => {
  describe("FinalVariablesMustBeFinal", () => {
    it("should detect variables that should be final", async () => {
      const violations = await runPMD(
        "rulesets/modifiers/FinalVariablesMustBeFinal.xml",
        "tests/fixtures/negative/modifiers/FinalVariablesMustBeFinal.cls"
      );
      expect(
        violations.filter((v) => v.rule === "FinalVariablesMustBeFinal").length
      ).toBeGreaterThan(0);
    });

    it("should not flag variables that are reassigned or already final", async () => {
      const violations = await runPMD(
        "rulesets/modifiers/FinalVariablesMustBeFinal.xml",
        "tests/fixtures/positive/modifiers/FinalVariablesMustBeFinal.cls"
      );
      assertNoViolations(violations, "FinalVariablesMustBeFinal");
    });
  });

  describe("StaticMethodsMustBeStatic", () => {
    it("should detect methods that should be static", async () => {
      const violations = await runPMD(
        "rulesets/modifiers/StaticMethodsMustBeStatic.xml",
        "tests/fixtures/negative/modifiers/StaticMethodsMustBeStatic.cls"
      );
      expect(
        violations.filter((v) => v.rule === "StaticMethodsMustBeStatic").length
      ).toBeGreaterThan(0);
    });

    it("should not flag methods that use instance state or are already static", async () => {
      const violations = await runPMD(
        "rulesets/modifiers/StaticMethodsMustBeStatic.xml",
        "tests/fixtures/positive/modifiers/StaticMethodsMustBeStatic.cls"
      );
      assertNoViolations(violations, "StaticMethodsMustBeStatic");
    });
  });

  describe("RegexPatternsMustBeStaticFinal", () => {
    it("should detect inline regex patterns", async () => {
      const violations = await runPMD(
        "rulesets/modifiers/RegexPatternsMustBeStaticFinal.xml",
        "tests/fixtures/negative/modifiers/RegexPatternsMustBeStaticFinal.cls"
      );
      expect(
        violations.filter((v) => v.rule === "RegexPatternsMustBeStaticFinal").length
      ).toBeGreaterThan(0);
    });

    it("should not flag static final regex patterns", async () => {
      const violations = await runPMD(
        "rulesets/modifiers/RegexPatternsMustBeStaticFinal.xml",
        "tests/fixtures/positive/modifiers/RegexPatternsMustBeStaticFinal.cls"
      );
      assertNoViolations(violations, "RegexPatternsMustBeStaticFinal");
    });
  });

  describe("StaticVariablesMustBeFinalAndScreamingSnakeCase", () => {
    it("should detect static variables that are not final or not SCREAMING_SNAKE_CASE", async () => {
      const violations = await runPMD(
        "rulesets/modifiers/StaticVariablesMustBeFinalAndScreamingSnakeCase.xml",
        "tests/fixtures/negative/modifiers/StaticVariablesMustBeFinalAndScreamingSnakeCase.cls"
      );
      expect(
        violations.filter((v) => v.rule === "StaticVariablesMustBeFinalAndScreamingSnakeCase")
          .length
      ).toBeGreaterThan(0);
    });

    it("should not flag static final variables in SCREAMING_SNAKE_CASE", async () => {
      const violations = await runPMD(
        "rulesets/modifiers/StaticVariablesMustBeFinalAndScreamingSnakeCase.xml",
        "tests/fixtures/positive/modifiers/StaticVariablesMustBeFinalAndScreamingSnakeCase.cls"
      );
      assertNoViolations(violations, "StaticVariablesMustBeFinalAndScreamingSnakeCase");
    });
  });

  describe("TestClassIsParallel", () => {
    it("should detect test classes without IsParallel=true", async () => {
      const violations = await runPMD(
        "rulesets/modifiers/TestClassIsParallel.xml",
        "tests/fixtures/negative/modifiers/TestClassIsParallel.cls"
      );
      expect(violations.filter((v) => v.rule === "TestClassIsParallel").length).toBeGreaterThan(0);
    });

    it("should not flag test classes with IsParallel=true", async () => {
      const violations = await runPMD(
        "rulesets/modifiers/TestClassIsParallel.xml",
        "tests/fixtures/positive/modifiers/TestClassIsParallel.cls"
      );
      assertNoViolations(violations, "TestClassIsParallel");
    });
  });
});
