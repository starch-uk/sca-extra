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

    // Valid: Pattern from method/constructor argument
    public void methodWithPattern(String pattern) {
        Pattern p = Pattern.compile(pattern);
    }

    // Valid: Pattern from attribute of argument
    public void methodWithPatternFromAttribute(Account acc) {
        Pattern p = Pattern.compile(acc.Name);
    }

    // Valid: Pattern from method output
    public void methodWithPatternFromMethod() {
        Pattern p = Pattern.compile(getPattern());
    }

    // Valid: Pattern.split() used with static final Pattern
    private static final Pattern SPLIT_PATTERN = Pattern.compile(',');
    public void methodWithPatternSplit() {
        List<String> parts = SPLIT_PATTERN.split('a,b,c');
    }

    // Valid: String.split() with parameter (input string is also a parameter)
    public void methodWithStringSplit(String input, String delimiter) {
        List<String> parts = input.split(delimiter);
    }

    // Valid: String.split() with hardcoded delimiter (input string is a parameter)
    public void methodWithStringSplitHardcoded(String input) {
        List<String> parts = input.split(',');
    }

    // Valid: String.matches() with parameter (input string is also a parameter)
    public void methodWithStringMatches(String input, String pattern) {
        Boolean matches = input.matches(pattern);
    }

    // Valid: String.matches() with hardcoded input (pattern is a parameter)
    public void methodWithStringMatchesHardcoded(String pattern) {
        Boolean matches = 'test'.matches(pattern);
    }

    // Valid: String.replaceAll() with parameter (input string is also a parameter)
    public void methodWithStringReplaceAll(String input, String regex) {
        String replaced = input.replaceAll(regex, 'X');
    }

    // Valid: String.replaceFirst() with parameter (input string is also a parameter)
    public void methodWithStringReplaceFirst(String input, String regex) {
        String replaced = input.replaceFirst(regex, 'X');
    }

    private String getPattern() {
        return 'dynamic';
    }
}

