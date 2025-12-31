public class Example {
    public void method(String input) {
        // Violation: Inline regex pattern
        Pattern p = Pattern.compile('test.*pattern');

        // Violation: Inline regex in matches
        Boolean matches = 'test'.matches('test.*pattern');

        // Violation: Regex pattern not static final
        String pattern = 'test.*pattern';
        Pattern.compile(pattern);

        // Violation: Local variable (not parameter) used in Pattern.compile
        String localPattern = 'local';
        Pattern.compile(localPattern);

        // Violation: Pattern.compile() with .pattern() on existing Pattern (should reuse existing Pattern object)
        Pattern existing = Pattern.compile('existing');
        Pattern p2 = Pattern.compile(existing.pattern());

        // Violation: Pattern.matches() static method with inline regex pattern
        Boolean matches3 = Pattern.matches('test.*pattern', 'test123');

        // Violation: Pattern.matches() static method with inline regex pattern (pattern first, input second)
        Boolean matches4 = Pattern.matches('^[A-Z]+$', input);

        // Violation: String.split() with inline regex pattern
        List<String> parts2 = 'a,b,c'.split(',');

        // Violation: String.matches() with inline regex pattern
        Boolean matches2 = 'test'.matches('test.*');

        // Violation: String.replaceAll() with inline regex pattern
        String replaced = 'abc123'.replaceAll('\\d', 'X');

        // Violation: String.replaceFirst() with inline regex pattern
        String replaced2 = 'abc123'.replaceFirst('\\d', 'X');
    }
}

