public class Example {
    // Violation: Class with only fields and constructors, no instance methods
    public class ParameterClass {
        public String name;
        public Integer age;

        public ParameterClass(String name, Integer age) {
            this.name = name;
            this.age = age;
        }
    }

    // Violation: Inner class with only fields and constructors
    public class DataClass {
        private String value;

        public DataClass(String value) {
            this.value = value;
        }
    }
}

