public class Example {
    public void testMethod() {
        // Violation: String.join with empty separator where strings have common suffix
        String result = String.join('', new List<String>{
            'line1\n',
            'line2\n',
            'line3\n',
            'last'
        });

        // Violation: Empty separator with common suffix
        String text = String.join(new List<String>{
            'item1,',
            'item2,',
            'item3,',
            'final'
        }, '');

        // Violation: Empty separator with multi-character common suffix
        String text2 = String.join(new List<String>{
            'item1ABCDEFG',
            'item2ABCDEFG',
            'item3ABCDEFG',
            'final'
        }, '');
    }
}

