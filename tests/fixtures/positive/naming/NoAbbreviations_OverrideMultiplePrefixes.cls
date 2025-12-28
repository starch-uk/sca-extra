public class ExampleMultiplePrefixes {
	public void method() {
		Integer preCtx = 0; // 'ctx' is abbreviated, but 'pre' prefix should allow it
		Integer postCtx = 1; // 'ctx' is abbreviated, but 'post' prefix should allow it
		Integer ctx = 2; // 'ctx' is abbreviated, no prefix, should be flagged
	}
}
