public class Example {
    public void testMethod() {
        // Violation: Method call as argument
        processData(getValue());

        // Violation: Method call as argument to constructor
        String result = new String(getValue());

        // Violation: Nested method calls as arguments
        processData(transformData(getValue()));
    }
}

