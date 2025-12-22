public class Example {
    // Violation: Inner class with only fields, no methods
    public class ParameterObject {
        public String name;
        public Integer age;
        public String email;
    }

    // Violation: Nested class used only for parameters
    private class ConfigParams {
        public String host;
        public Integer port;
        public Boolean ssl;
    }
}

