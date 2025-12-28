public class Example {
    // Valid: Class with instance methods
    public class ValidClass {
        public String name;
        public Integer age;

        public ValidClass(String name, Integer age) {
            this.name = name;
            this.age = age;
        }

        public String getName() {
            return name;
        }

        public void setAge(Integer age) {
            this.age = age;
        }
    }

    // Valid: Class with static methods (not counted as instance methods)
    public class UtilityClass {
        public String value;

        public UtilityClass(String value) {
            this.value = value;
        }

        public static void staticMethod() {
            // Static method
        }
    }
}

