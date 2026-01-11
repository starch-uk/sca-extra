public class Example {
    public void method() {
        // Violation: Single argument method call on multiple lines
        processData(
            getValue()
        );

        // Violation: Zero argument method call on multiple lines
        processData(
        );

        // Violation: Single argument with variable on multiple lines
        String result = processValue(
            value
        );

        // Violation: Method call with single string argument on multiple lines
        logMessage(
            'Error occurred'
        );

        // Violation: Static method call on multiple lines
        Utils.process(
            data
        );
    }
}

