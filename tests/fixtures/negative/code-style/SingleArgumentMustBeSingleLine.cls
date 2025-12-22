public class Example {
    public void testMethod() {
        // Violation: Single argument method call on multiple lines
        processData(
            getValue()
        );

        // Violation: Zero argument method call on multiple lines
        processData(
        );
    }
}

