public class Example {
    // Valid: Inner class with methods
    public class ValidClass {
        public String name;
        public Integer age;

        public void setName(String name) {
            this.name = name;
        }
    }

    // Valid: Class with InvocableVariable annotation
    public class FlowParameters {
        @InvocableVariable
        public String input;
    }

    // Valid: Outer class (not nested)
    public class RegularClass {
        public String value;
    }
}

