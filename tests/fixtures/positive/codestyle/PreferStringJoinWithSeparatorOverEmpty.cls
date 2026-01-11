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

        // Valid: Non-empty separator with empty strings in list
        final String inputString1 = String.join(
            new List<String>{
                'items[3]:',
                '  - a',
                '',
                '  - b',
                '  - c'
            },
            '\n'
        );

        // Valid: Non-empty separator with empty strings in list
        final String inputString2 = String.join(
            new List<String>{
                'items[2]{id}:',
                '  1',
                '',
                '  2'
            },
            '\n'
        );

        // Valid: Non-empty separator with multiple empty strings in list
        final String inputString3 = String.join(
            new List<String>{
                'items[2]:',
                '  - a',
                '',
                '',
                '  - b'
            },
            '\n'
        );

        // Valid: Non-empty separator with empty strings in nested structure
        final String inputString4 = String.join(
            new List<String>{
                'outer[2]:',
                '  - inner[2]:',
                '    - a',
                '',
                '    - b',
                '  - x'
            },
            '\n'
        );

        // Valid: Extreme case - many empty strings in list with non-empty separator
        final String extremeCase = String.join(
            new List<String>{
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                ''
            },
            '\n'
        );
    }
}

