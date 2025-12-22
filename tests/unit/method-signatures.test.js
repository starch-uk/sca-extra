const { runPMD, assertNoViolations } = require("../helpers/pmd-helper");

describe("Method Signature Rules", () => {
  describe("NoCustomParameterObjects", () => {
    it("should detect inner classes with only fields and no methods", async () => {
      const violations = await runPMD(
        "rulesets/method-signatures/NoCustomParameterObjects.xml",
        "tests/fixtures/negative/method-signatures/NoCustomParameterObjects.cls"
      );
      expect(
        violations.filter((v) => v.rule === "NoCustomParameterObjects").length
      ).toBeGreaterThan(0);
    });

    it("should not flag inner classes with methods or InvocableVariable annotations", async () => {
      const violations = await runPMD(
        "rulesets/method-signatures/NoCustomParameterObjects.xml",
        "tests/fixtures/positive/method-signatures/NoCustomParameterObjects.cls"
      );
      assertNoViolations(violations, "NoCustomParameterObjects");
    });
  });

  describe("SingleParameterMustBeSingleLine", () => {
    it("should detect methods with 0-1 parameters on multiple lines", async () => {
      const violations = await runPMD(
        "rulesets/method-signatures/SingleParameterMustBeSingleLine.xml",
        "tests/fixtures/negative/method-signatures/SingleParameterMustBeSingleLine.cls"
      );
      expect(
        violations.filter((v) => v.rule === "SingleParameterMustBeSingleLine").length
      ).toBeGreaterThan(0);
    });

    it("should not flag methods with 0-1 parameters on one line", async () => {
      const violations = await runPMD(
        "rulesets/method-signatures/SingleParameterMustBeSingleLine.xml",
        "tests/fixtures/positive/method-signatures/SingleParameterMustBeSingleLine.cls"
      );
      assertNoViolations(violations, "SingleParameterMustBeSingleLine");
    });
  });
});
