public class Example {
    public void testMethod() {
        // Violation: Inline regex pattern
        Pattern p = Pattern.compile('test.*pattern');

        // Violation: Inline regex in matches
        Boolean matches = 'test'.matches('test.*pattern');

        // Violation: Regex pattern not static final
        String pattern = 'test.*pattern';
        Pattern.compile(pattern);
    }
}

