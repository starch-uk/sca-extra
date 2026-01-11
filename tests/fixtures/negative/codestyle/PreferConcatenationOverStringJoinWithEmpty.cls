public class Example {
    public void method() {
        // Violation: String.join with empty separator
        String result = String.join('', new List<String>{'a', 'b', 'c'});

        // Violation: String.join with empty string separator
        String text = String.join(new List<String>{'x', 'y', 'z'}, '');
    }
}

