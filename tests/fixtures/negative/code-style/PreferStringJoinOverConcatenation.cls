public class Example {
    public void testMethod() {
        // Violation: Multiple concatenations with common separator
        String result = 'line1\n' + 'line2\n' + 'line3';

        // Violation: Three strings with common separator
        String text = 'first,' + 'second,' + 'third';

        // Violation: More concatenations with newline
        String multiLine = 'a\n' + 'b\n' + 'c\n' + 'd';
    }
}

