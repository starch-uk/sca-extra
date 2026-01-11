public class Example {
    public void testMethod() {
        // Valid: Using String.join
        String text = String.join(new List<String>{
            'line1',
            'line2',
            'line3'
        }, '\n');

        // Valid: Single newline (only one)
        String singleLine = 'line1\nline2';

        // Valid: No newlines
        String noNewlines = 'line1line2line3';
    }
}

