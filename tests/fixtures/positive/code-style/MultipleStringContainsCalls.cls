public class Example {
    public void testMethod() {
        // Valid: Single contains() call
        if (str.contains('a')) {
            // ...
        }

        // Valid: Using regex pattern instead
        Pattern pattern = Pattern.compile('error|warning|fatal');
        if (pattern.matcher(text).matches()) {
            // ...
        }

        // Valid: Single contains() in while
        while (value.contains('x')) {
            // ...
        }
    }
}

