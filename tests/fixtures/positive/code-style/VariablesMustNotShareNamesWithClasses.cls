public class Example {
    public void testMethod() {
        // Valid: Variable name doesn't match class name (different name)
        Example instance = new Example();

        // Valid: Variable name doesn't match class name (abbreviation)
        Example obj = new Example();

        // Valid: Variable name doesn't match class name (with suffix)
        Example exampleInstance = new Example();

        // Valid: Variable name doesn't match class name (with prefix)
        Example myExample = new Example();

        // Valid: Variable name doesn't match class name (descriptive)
        Example exampleObj = new Example();

        // Valid: Variable name doesn't match class name (plural)
        Example examples = new Example();

        // Valid: Variable name doesn't match class name (different word)
        Example item = new Example();
    }

    public class InnerClass {
        public void method() {
            // Valid: Variable name doesn't match inner class name
            InnerClass instance = new InnerClass();

            // Valid: Variable name doesn't match inner class name (with suffix)
            InnerClass innerClassInstance = new InnerClass();

            // Valid: Variable name doesn't match inner class name (abbreviation)
            InnerClass ic = new InnerClass();

            // Valid: Variable name doesn't match inner class name (different word)
            InnerClass item = new InnerClass();
        }
    }
    
    public class ClassName {
        public void method() {
            // Valid: Variable name doesn't match class name (different name with suffix)
            ClassName classNameBob = new ClassName();
            
            // Valid: Variable name doesn't match class name (generic name)
            ClassName instance = new ClassName();
            
            // Valid: Variable name doesn't match class name (abbreviation)
            ClassName obj = new ClassName();

            // Valid: Variable name doesn't match class name (with prefix)
            ClassName myClassName = new ClassName();

            // Valid: Variable name doesn't match class name (plural)
            ClassName classNames = new ClassName();

            // Valid: Variable name doesn't match class name (descriptive)
            ClassName classNameInstance = new ClassName();
        }
    }

    public class A {
        public void method() {
            // Valid: Single letter class, different variable name
            A item = new A();
            A instance = new A();
            A obj = new A();
        }
    }

    public class TestHelper {
        public void method() {
            // Valid: Multi-word class, different variable name
            TestHelper helper = new TestHelper();
            TestHelper testHelperInstance = new TestHelper();
            TestHelper myTestHelper = new TestHelper();
            TestHelper helperInstance = new TestHelper();
        }
    }

    public class Account {
        public void method() {
            // Valid: Partial match is allowed (accountName vs Account)
            String accountName = 'Test';
            String accountId = '123';
            String accountNumber = '456';
        }
    }
}

