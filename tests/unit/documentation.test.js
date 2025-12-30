const { runPMD, assertNoViolations } = require('../helpers/pmd-helper');

describe('Documentation Rules', () => {
	describe('ExceptionDocumentationRequired', () => {
		it('should detect methods that throw exceptions without @throws documentation', async () => {
			const violations = await runPMD(
				'rulesets/documentation/ExceptionDocumentationRequired.xml',
				'tests/fixtures/negative/documentation/ExceptionDocumentationRequired.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'ExceptionDocumentationRequired'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag methods with @throws documentation', async () => {
			const violations = await runPMD(
				'rulesets/documentation/ExceptionDocumentationRequired.xml',
				'tests/fixtures/positive/documentation/ExceptionDocumentationRequired.cls'
			);
			assertNoViolations(violations, 'ExceptionDocumentationRequired');
		});
	});

	describe('SingleLineDocumentationFormat', () => {
		it('should detect improperly formatted single-line ApexDoc comments', async () => {
			const violations = await runPMD(
				'rulesets/documentation/SingleLineDocumentationFormat.xml',
				'tests/fixtures/negative/documentation/SingleLineDocumentationFormat.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'SingleLineDocumentationFormat'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag properly formatted single-line or valid multi-line comments', async () => {
			const violations = await runPMD(
				'rulesets/documentation/SingleLineDocumentationFormat.xml',
				'tests/fixtures/positive/documentation/SingleLineDocumentationFormat.cls'
			);
			assertNoViolations(violations, 'SingleLineDocumentationFormat');
		});
	});

	describe('ValidGroupTagValues', () => {
		it('should detect @group tags with invalid values', async () => {
			const violations = await runPMD(
				'rulesets/documentation/ValidGroupTagValues.xml',
				'tests/fixtures/negative/documentation/ValidGroupTagValues.cls'
			);
			expect(
				violations.filter((v) => v.rule === 'ValidGroupTagValues')
					.length
			).toBeGreaterThan(0);
		});

		it('should not flag @group tags with valid values', async () => {
			const violations = await runPMD(
				'rulesets/documentation/ValidGroupTagValues.xml',
				'tests/fixtures/positive/documentation/ValidGroupTagValues.cls'
			);
			assertNoViolations(violations, 'ValidGroupTagValues');
		});
	});

	describe('ProhibitAuthorSinceVersionTags', () => {
		it('should detect @author, @since, or @version tags', async () => {
			const violations = await runPMD(
				'rulesets/documentation/ProhibitAuthorSinceVersionTags.xml',
				'tests/fixtures/negative/documentation/ProhibitAuthorSinceVersionTags.cls'
			);
			expect(
				violations.filter(
					(v) => v.rule === 'ProhibitAuthorSinceVersionTags'
				).length
			).toBeGreaterThan(0);
		});

		it('should not flag comments without @author, @since, or @version tags', async () => {
			const violations = await runPMD(
				'rulesets/documentation/ProhibitAuthorSinceVersionTags.xml',
				'tests/fixtures/positive/documentation/ProhibitAuthorSinceVersionTags.cls'
			);
			assertNoViolations(violations, 'ProhibitAuthorSinceVersionTags');
		});
	});
});
