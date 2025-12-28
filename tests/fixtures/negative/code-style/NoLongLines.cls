public class Example {
    public void method1() {
        // This is a very long comment that exceeds eighty characters in length
        Integer x = 5;
    }

    public void method2() {
        String s = 'This is an extremely long string literal that goes beyond the 80 character limit';
        return s;
    }

    private Integer calculateWithVeryLongMethodNameThatExceedsTheLimit(Integer a, Integer b) {
        return a + b;
    }

    public void anotherMethod() {
        Integer veryLongVariableNameThatExceedsEightyCharactersInLength = 123;
        System.debug('Value: ' + veryLongVariableNameThatExceedsEightyCharactersInLength);
    }

    public void methodWithLongLine() {
        if (someVeryLongConditionThatExceedsTheEightyCharacterLimit == true) {
            System.debug('Violation');
        }
    }
}

