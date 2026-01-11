public class Example {
    public void testMethod() {
        // Valid: String concatenation
        String result = 'a' + 'b' + 'c';

        // Valid: String.join with non-empty separator
        String text = String.join(new List<String>{'x', 'y', 'z'}, ',');

        // Valid: String.join with single string
        String single = String.join('', new List<String>{'a'});

        // Valid: String.join with non-empty separator (newline), even if list contains empty string
        final String inputString = String.join(
            new List<String>{
                'items[3]:',
                '  - a',
                '',
                '  - b',
                '  - c'
            },
            '\n'
        );
    }
}

