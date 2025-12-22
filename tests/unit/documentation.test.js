const { runPMD, assertNoViolations } = require("../helpers/pmd-helper");

describe("Documentation Rules", () => {
  describe("AnnotationBeforeComment", () => {
    it("should detect comments before annotations", async () => {
      const violations = await runPMD(
        "rulesets/documentation/AnnotationBeforeComment.xml",
        "tests/fixtures/negative/documentation/AnnotationBeforeComment.cls"
      );
      expect(violations.filter((v) => v.rule === "AnnotationBeforeComment").length).toBeGreaterThan(
        0
      );
    });

    it("should not flag annotations before comments", async () => {
      const violations = await runPMD(
        "rulesets/documentation/AnnotationBeforeComment.xml",
        "tests/fixtures/positive/documentation/AnnotationBeforeComment.cls"
      );
      assertNoViolations(violations, "AnnotationBeforeComment");
    });
  });

  describe("ExceptionDocumentationRequired", () => {
    it("should detect methods that throw exceptions without @throws documentation", async () => {
      const violations = await runPMD(
        "rulesets/documentation/ExceptionDocumentationRequired.xml",
        "tests/fixtures/negative/documentation/ExceptionDocumentationRequired.cls"
      );
      expect(
        violations.filter((v) => v.rule === "ExceptionDocumentationRequired").length
      ).toBeGreaterThan(0);
    });

    it("should not flag methods with @throws or @exception documentation", async () => {
      const violations = await runPMD(
        "rulesets/documentation/ExceptionDocumentationRequired.xml",
        "tests/fixtures/positive/documentation/ExceptionDocumentationRequired.cls"
      );
      assertNoViolations(violations, "ExceptionDocumentationRequired");
    });
  });

  describe("SingleLineDocumentationFormat", () => {
    it("should detect improperly formatted single-line ApexDoc comments", async () => {
      const violations = await runPMD(
        "rulesets/documentation/SingleLineDocumentationFormat.xml",
        "tests/fixtures/negative/documentation/SingleLineDocumentationFormat.cls"
      );
      expect(
        violations.filter((v) => v.rule === "SingleLineDocumentationFormat").length
      ).toBeGreaterThan(0);
    });

    it("should not flag properly formatted single-line or valid multi-line comments", async () => {
      const violations = await runPMD(
        "rulesets/documentation/SingleLineDocumentationFormat.xml",
        "tests/fixtures/positive/documentation/SingleLineDocumentationFormat.cls"
      );
      assertNoViolations(violations, "SingleLineDocumentationFormat");
    });
  });
});
