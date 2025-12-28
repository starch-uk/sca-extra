public class Example {
    // Violation: Inner class with only 1 field, no methods
    public class SingleFieldParam {
        public String name;
    }

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

        public ConfigParams(String host, Integer port, Boolean ssl) {
            this.host = host;
            this.port = port;
            this.ssl = ssl;
        }
    }
}

