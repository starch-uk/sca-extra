// Violation: prettier-ignore comment
// prettier-ignore
public class Example {
	public void method1() {
		String x = 'test';
	}

	// Violation: prettier-ignore with additional text
	// prettier-ignore - don't format this
	public void method2() {
		Integer count = 5;
	}

	// Violation: prettier-ignore in middle of code
	public void method3() {
		// prettier-ignore
		Boolean flag = true;
	}
}
