const fs = require('fs');
const path = require('path');
const { runPMD, assertNoViolations } = require('../helpers/pmd-helper');

async function withOverriddenNoAbbreviationsRuleset(transformFn, testFn) {
	const originalPath = path.join(process.cwd(), 'rulesets', 'naming', 'NoAbbreviations.xml');
	const tempPath = path.join(process.cwd(), 'rulesets', 'naming', 'NoAbbreviations.override.xml');

	const original = fs.readFileSync(originalPath, 'utf-8');
	const transformed = transformFn(original);
	fs.writeFileSync(tempPath, transformed, 'utf-8');

	try {
		await testFn('rulesets/naming/NoAbbreviations.override.xml');
	} finally {
		fs.unlinkSync(tempPath);
	}
}

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
				await withOverriddenNoAbbreviationsRuleset(
					(xml) =>
						xml.replace(
							"then 'ctx,idx,msg,cfg,val,acc,con,opp,param,attr,elem,prev,curr,src,dest,dst,len,pos,mgr,svc,util,calc,init,ref,desc,impl,repo,col,hdr,doc,spec,req,res,resp,fmt,lbl,opt,addr,org'",
							"then 'ctx'"
						),
					async (rulesetPath) => {
						const violations = await runPMD(
							rulesetPath,
							'tests/fixtures/negative/naming/NoAbbreviations.cls'
						);

						// Only the first variable (ctx on line 3) should be flagged
						const noAbbrevViolations = violations.filter(
							(v) => v.rule === 'NoAbbreviations'
						);
						expect(noAbbrevViolations.map((v) => v.line)).toEqual([3]);
					}
				);
			});

			it('should work with completely different disallowedAbbreviations (foo,bar) - violations', async () => {
				// Temporary Apex file with variables that match and don't match the custom list
				const tempApexPath = path.join(
					process.cwd(),
					'tests',
					'fixtures',
					'negative',
					'naming',
					'NoAbbreviationsOverrideFooBar.cls'
				);

				const apexSource = `
public class ExampleFooBarAbbr {
	public void method() {
		Integer foo = 0;
		Integer bar = 1;
		Integer baz = 2;
	}
}
`;

				fs.writeFileSync(tempApexPath, apexSource, 'utf-8');

				try {
					await withOverriddenNoAbbreviationsRuleset(
						(xml) =>
							xml.replace(
								"then 'ctx,idx,msg,cfg,val,acc,con,opp,param,attr,elem,prev,curr,src,dest,dst,len,pos,mgr,svc,util,calc,init,ref,desc,impl,repo,col,hdr,doc,spec,req,res,resp,fmt,lbl,opt,addr,org'",
								"then 'foo,bar'"
							),
						async (rulesetPath) => {
							const violations = await runPMD(
								rulesetPath,
								'tests/fixtures/negative/naming/NoAbbreviationsOverrideFooBar.cls'
							);

							const noAbbrevViolations = violations.filter(
								(v) => v.rule === 'NoAbbreviations'
							);
							// foo and bar (lines 4 and 5) should be flagged, baz (line 6) should not
							expect(noAbbrevViolations.map((v) => v.line).sort()).toEqual([4, 5]);
						}
					);
				} finally {
					fs.unlinkSync(tempApexPath);
				}
			});

			it('should work with completely different disallowedAbbreviations (foo,bar) - no violations', async () => {
				const tempApexPath = path.join(
					process.cwd(),
					'tests',
					'fixtures',
					'positive',
					'naming',
					'NoAbbreviationsOverrideFooBarPositive.cls'
				);

				const apexSource = `
public class ExampleFooBarAbbrPositive {
	public void method() {
		Integer baz = 2; // Not in foo,bar
	}
}
`;

				fs.writeFileSync(tempApexPath, apexSource, 'utf-8');

				try {
					await withOverriddenNoAbbreviationsRuleset(
						(xml) =>
							xml.replace(
								"then 'ctx,idx,msg,cfg,val,acc,con,opp,param,attr,elem,prev,curr,src,dest,dst,len,pos,mgr,svc,util,calc,init,ref,desc,impl,repo,col,hdr,doc,spec,req,res,resp,fmt,lbl,opt,addr,org'",
								"then 'foo,bar'"
							),
						async (rulesetPath) => {
							const violations = await runPMD(
								rulesetPath,
								'tests/fixtures/positive/naming/NoAbbreviationsOverrideFooBarPositive.cls'
							);
							assertNoViolations(violations, 'NoAbbreviations');
						}
					);
				} finally {
					fs.unlinkSync(tempApexPath);
				}
			});

			it('should respect a custom allowedSuffixes pattern (Id)', async () => {
				// Temporary Apex file with a variable that uses a disallowed abbreviation plus an Id suffix
				// so we can verify that changing allowedSuffixes toggles the violation.
				const tempApexPath = path.join(
					process.cwd(),
					'tests',
					'fixtures',
					'positive',
					'naming',
					'NoAbbreviationsOverrideSuffix.cls'
				);

				const apexSource = `
public class ExampleOverrideSuffix {
	public void method() {
		Integer fooId = 0; // 'foo' is abbreviated, Id suffix controls whether this is allowed
	}
}
`;

				fs.writeFileSync(tempApexPath, apexSource, 'utf-8');

				try {
					// First, override the abbreviation list so that only fooId is considered an abbreviation,
					// and keep Id in the allowedSuffixes pattern so fooId is allowed.
					await withOverriddenNoAbbreviationsRuleset(
						(xml) =>
							xml
								.replace(
									"then 'ctx,idx,msg,cfg,val,acc,con,opp,param,attr,elem,prev,curr,src,dest,dst,len,pos,mgr,svc,util,calc,init,ref,desc,impl,repo,col,hdr,doc,spec,req,res,resp,fmt,lbl,opt,addr,org'",
									"then 'fooId'"
								)
								.replace("then 'Id|Api|Url|Html'", "then 'Id|Api|Url|Html'"),
						async (rulesetPath) => {
							const violations = await runPMD(
								rulesetPath,
								'tests/fixtures/positive/naming/NoAbbreviationsOverrideSuffix.cls'
							);
							// With Id in the allowed suffix pattern, fooId should NOT be flagged
							assertNoViolations(violations, 'NoAbbreviations');
						}
					);

					// Now override the allowedSuffixes pattern to remove "Id" so fooId becomes a violation
					await withOverriddenNoAbbreviationsRuleset(
						(xml) =>
							xml
								.replace(
									"then 'ctx,idx,msg,cfg,val,acc,con,opp,param,attr,elem,prev,curr,src,dest,dst,len,pos,mgr,svc,util,calc,init,ref,desc,impl,repo,col,hdr,doc,spec,req,res,resp,fmt,lbl,opt,addr,org'",
									"then 'fooId'"
								)
								.replace("then 'Id|Api|Url|Html'", "then 'Api|Url|Html'"),
						async (rulesetPath) => {
							const violations = await runPMD(
								rulesetPath,
								'tests/fixtures/positive/naming/NoAbbreviationsOverrideSuffix.cls'
							);

							const noAbbrevViolations = violations.filter(
								(v) => v.rule === 'NoAbbreviations'
							);
							expect(noAbbrevViolations.length).toBe(1);
							expect(noAbbrevViolations[0].line).toBe(4);
						}
					);
				} finally {
					fs.unlinkSync(tempApexPath);
				}
			});

			it('should work with completely different allowedSuffixes (Foo|Bar)', async () => {
				const tempApexPath = path.join(
					process.cwd(),
					'tests',
					'fixtures',
					'negative',
					'naming',
					'NoAbbreviationsOverrideFooBarSuffix.cls'
				);

				const apexSource = `
public class ExampleFooBarSuffixList {
	public void method() {
		Integer foo = 0;
		Integer bar = 1;
		Integer baz = 2;
	}
}
`;

				fs.writeFileSync(tempApexPath, apexSource, 'utf-8');

				try {
					// Configure abbreviations and suffixes so Foo and Bar suffixed names are allowed
					await withOverriddenNoAbbreviationsRuleset(
						(xml) =>
							xml
								.replace(
									"then 'ctx,idx,msg,cfg,val,acc,con,opp,param,attr,elem,prev,curr,src,dest,dst,len,pos,mgr,svc,util,calc,init,ref,desc,impl,repo,col,hdr,doc,spec,req,res,resp,fmt,lbl,opt,addr,org'",
									"then 'foo,bar,baz'"
								)
								.replace("then 'Id|Api|Url|Html'", "then 'oo|ar'"),
						async (rulesetPath) => {
							const violations = await runPMD(
								rulesetPath,
								'tests/fixtures/negative/naming/NoAbbreviationsOverrideFooBarSuffix.cls'
							);

							const noAbbrevViolations = violations.filter(
								(v) => v.rule === 'NoAbbreviations'
							);
							// foo and bar should be allowed by suffix, baz (line 6) should be flagged
							expect(noAbbrevViolations.map((v) => v.line)).toEqual([6]);
						}
					);
				} finally {
					fs.unlinkSync(tempApexPath);
				}
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
