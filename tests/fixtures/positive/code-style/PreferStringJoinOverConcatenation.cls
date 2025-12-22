public class Example {
    public void testMethod() {
        // Valid: Using String.join
        String result = String.join(new List<String>{
            'line1',
            'line2',
            'line3'
        }, '\n');

        // Valid: Two strings (less than 3)
        String text = 'first' + 'second';

        // Valid: No common separator
        String mixed = 'a\n' + 'b' + 'c';

        // Valid: Last string has separator too
        String allWithSeparator = 'a\n' + 'b\n' + 'c\n';
    }
}

