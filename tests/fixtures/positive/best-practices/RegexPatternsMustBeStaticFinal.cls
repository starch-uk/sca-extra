public class Example {
    // Valid: Static final regex pattern
    private static final Pattern TEST_PATTERN = Pattern.compile('test.*pattern');

    // Valid: Static final regex pattern
    private static final String EMAIL_PATTERN_STR = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_PATTERN_STR);

    public void testMethod() {
        // Using static final pattern - valid
        Boolean matches = TEST_PATTERN.matcher('test123').matches();
    }
}

