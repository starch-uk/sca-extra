public class Example {
    public void testMethod() {
        // Valid: Combined if with &&
        if (condition1 && condition2) {
            doSomething();
        }

        // Valid: Nested if with else (cannot be combined)
        if (condition1) {
            if (condition2) {
                doSomething();
            } else {
                doSomethingElse();
            }
        }

        // Valid: Nested if with multiple statements (cannot be combined)
        if (condition1) {
            if (condition2) {
                doSomething();
                doMore();
            }
        }
    }
}

