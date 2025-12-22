public class Example {
    public void testMethod() {
        // Violation: Nested if that can be combined
        if (condition1) {
            if (condition2) {
                doSomething();
            }
        }

        // Violation: Nested if with single statement
        if (x > 0) {
            if (y > 0) {
                process();
            }
        }
    }
}

