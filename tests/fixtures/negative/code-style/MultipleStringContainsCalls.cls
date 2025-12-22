public class Example {
    public void testMethod() {
        // Violation: Two contains() calls in if
        if (str.contains('a') && str.contains('b')) {
            // ...
        }

        // Violation: Multiple contains() calls
        if (text.contains('error') || text.contains('warning') || text.contains('fatal')) {
            // ...
        }

        // Violation: Two contains() calls in while
        while (value.contains('x') && value.contains('y')) {
            // ...
        }
    }
}

