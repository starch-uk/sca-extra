public class Example {
    public void testMethod() {
        // Violation: Variable name matches class name
        Example example = new Example();

        // Violation: Variable name matches class name (case insensitive)
        String string = 'test';

        // Violation: Variable name matches inner class name
        InnerClass innerClass = new InnerClass();
    }

    public class InnerClass {
    }
}

