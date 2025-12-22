public class Example {
    public void method() {
        // Violation: Single argument method call on multiple lines
        processData(
            getValue()
        );

        // Violation: Zero argument method call on multiple lines
        processData(
        );
    }
}

