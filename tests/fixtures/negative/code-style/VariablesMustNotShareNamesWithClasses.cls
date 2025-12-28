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

    public class Request {
        public void method() {
            // Violation: Variable name matches class name (exact match)
            Request request = new Request();
            Request Request = new Request();
            Request REQUEST = new Request();
        }
    }

    public class Quote {
        public void method() {
            // Violation: Variable name matches class name (exact match, not plural)
            Quote quote = new Quote();
            Quote Quote = new Quote();
            Quote QUOTE = new Quote();
        }
    }

    public class Account {
        public void method() {
            // Violation: Variable name matches class name (exact match, not plural)
            Account account = new Account();
            Account Account = new Account();
            Account ACCOUNT = new Account();
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

    public class Dress {
        public void method() {
            // Violation: Variable name matches class name (exact match, case-insensitive)
            Dress dress = new Dress();
            Dress Dress = new Dress();
            Dress DRESS = new Dress();
            Dress DrEsS = new Dress();
        }
    }

    public class Order {
        public void method() {
            // Violation: Variable name matches class name (exact match, case-insensitive)
            Order order = new Order();
            Order Order = new Order();
            Order ORDER = new Order();
        }
    }

    public class Customer {
        public void method() {
            // Violation: Variable name matches class name (exact match, case-insensitive)
            Customer customer = new Customer();
            Customer Customer = new Customer();
            Customer CUSTOMER = new Customer();
        }
    }
}

