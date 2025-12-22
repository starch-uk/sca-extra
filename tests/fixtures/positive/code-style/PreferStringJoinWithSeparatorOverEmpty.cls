public class Example {
    public void testMethod() {
        // Valid: Using separator instead of empty
        String result = String.join('\n', new List<String>{
            'line1',
            'line2',
            'line3',
            'last'
        });

        // Valid: No common suffix
        String text = String.join('', new List<String>{
            'item1',
            'item2',
            'item3'
        });

        // Valid: Less than 3 strings
        String small = String.join('', new List<String>{
            'a',
            'b'
        });
    }
}

