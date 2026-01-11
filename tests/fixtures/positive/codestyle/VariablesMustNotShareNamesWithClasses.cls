public class Example {
    public void method() {
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
            // Valid: Plural is allowed
            Account accounts = new Account();
        }
    }

    public class Request {
        public void method() {
            // Valid: Single letter is allowed
            Request r = new Request();
            // Valid: Contains class name but is longer
            Request requestItem = new Request();
            Request requestData = new Request();
            Request requestObject = new Request();
        }
    }

    public class Response {
        public void method() {
            // Valid: Single letter/short name is allowed
            Response out = new Response();
            Response r = new Response();
        }
    }

    public class Quote {
        public void method() {
            // Valid: Plural is allowed
            Quote quotes = new Quote();
        }
    }

    public class Opportunity {
        public void method() {
            // Valid: Plural is allowed
            Opportunity opportunities = new Opportunity();
        }
    }

    public class Product {
        public void method() {
            // Valid: Plural is allowed
            Product products = new Product();
        }
    }

    public class Dress {
        public void method() {
            // Valid: Plural is allowed
            Dress dresses = new Dress();
            // Valid: Contains class name with prefix (camelCase)
            Dress myDress = new Dress();
            Dress redDress = new Dress();
            Dress blueDress = new Dress();
            Dress newDress = new Dress();
            // Valid: Contains class name with suffix (camelCase)
            Dress dressItem = new Dress();
            Dress dressObject = new Dress();
            Dress dressInstance = new Dress();
            Dress dressData = new Dress();
            // Valid: Contains class name in middle
            Dress myDressItem = new Dress();
            Dress redDressObject = new Dress();
            Dress newDressData = new Dress();
            // Valid: Single letter is allowed
            Dress d = new Dress();
            Dress r = new Dress();
        }
    }

    public class Order {
        public void method() {
            // Valid: Plural is allowed
            Order orders = new Order();
            // Valid: Contains class name with prefix
            Order myOrder = new Order();
            Order newOrder = new Order();
            // Valid: Contains class name with suffix
            Order orderItem = new Order();
            Order orderData = new Order();
            // Valid: Contains class name in middle
            Order myOrderItem = new Order();
        }
    }

    public class Customer {
        public void method() {
            // Valid: Plural is allowed
            Customer customers = new Customer();
            // Valid: Contains class name with prefix
            Customer myCustomer = new Customer();
            Customer newCustomer = new Customer();
            // Valid: Contains class name with suffix
            Customer customerData = new Customer();
            Customer customerInfo = new Customer();
            // Valid: Contains class name in middle
            Customer myCustomerData = new Customer();
        }
    }
}

