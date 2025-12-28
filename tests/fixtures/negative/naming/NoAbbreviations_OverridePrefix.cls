public class ExampleOverridePrefix {
	public void method() {
		Integer preCtx = 0; // 'ctx' is abbreviated, but 'pre' prefix should allow it
		Integer ctx = 1; // 'ctx' is abbreviated, no prefix, should be flagged
		Integer preBaz = 2; // 'baz' is not in abbreviation list, should not be flagged
	}
}
