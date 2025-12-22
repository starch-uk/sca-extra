public class Example {
    public void testMethod() {
        // Valid: Variable name doesn't match class name
        Example instance = new Example();

        // Valid: Variable name doesn't match class name
        Example obj = new Example();

        // Valid: Variable name doesn't match class name
        Example exampleInstance = new Example();
    }

    public class InnerClass {
        public void method() {
            // Valid: Variable name doesn't match inner class name
            InnerClass instance = new InnerClass();
        }
    }
}

