public class Example {
    public void method() {
        // Violation: Variable name matches class name (exact case)
        Example Example = new Example();

        // Violation: Variable name matches class name (all lowercase)
        Example example = new Example();

        // Violation: Variable name matches class name (all uppercase)
        Example EXAMPLE = new Example();

        // Violation: Variable name matches class name (mixed case)
        Example ExAmPlE = new Example();
    }

    public class InnerClass {
        public void method() {
            // Violation: Variable name matches inner class name (exact case)
            InnerClass InnerClass = new InnerClass();

            // Violation: Variable name matches inner class name (all lowercase)
            InnerClass innerClass = new InnerClass();

            // Violation: Variable name matches inner class name (all uppercase)
            InnerClass INNERCLASS = new InnerClass();

            // Violation: Variable name matches inner class name (mixed case)
            InnerClass InNeRcLaSs = new InnerClass();
        }
    }
    
    public class ClassName {
        public void method() {
            // Violation: Variable name matches class name (exact case)
            ClassName ClassName = new ClassName();

            // Violation: Variable name matches class name (all lowercase)
            ClassName classname = new ClassName();

            // Violation: Variable name matches class name (camelCase - matches)
            ClassName className = new ClassName();

            // Violation: Variable name matches class name (all uppercase)
            ClassName CLASSNAME = new ClassName();
        }
    }

    public class A {
        public void method() {
            // Violation: Single letter class name match
            A A = new A();
            A a = new A();
        }
    }

    public class TestHelper {
        public void method() {
            // Violation: Multi-word class name match
            TestHelper TestHelper = new TestHelper();
            TestHelper testHelper = new TestHelper();
            TestHelper TESTHELPER = new TestHelper();
        }
    }
}

