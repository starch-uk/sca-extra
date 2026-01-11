public class Example {
    // Violation: Static but not final
    private static String notFinal = 'value';
    private static Integer counter = 0;
    private static Boolean isEnabled = true;

    // Violation: Static final but camelCase
    private static final String defaultValue = 'test';
    private static final String maxRetryCount = 3;
    private static final String apiBaseUrl = 'https://api.example.com';

    // Violation: Static final but lowercase
    private static final String lowercase = 'value';
    private static final Integer count = 5;
    private static final Boolean enabled = true;

    // Violation: Static final but PascalCase
    private static final String DefaultValue = 'test';
    private static final String MaxRetryCount = 3;
    private static final String ApiBaseUrl = 'https://api.example.com';

    // Violation: Static final but snake_case (lowercase)
    private static final String default_value = 'test';
    private static final String max_retry_count = 3;
    private static final String api_base_url = 'https://api.example.com';

    // Violation: Static final but mixed case
    private static final String Mixed_Case = 'value';
    private static final String mixed_Case = 'value';
    private static final String MIXED_case = 'value';

    // Violation: Static final but starting with lowercase
    private static final String a_CONSTANT = 'a';
    private static final String x_VALUE = 1;

    // Violation: Static final but with lowercase in middle
    private static final String CONSTANT_value = 'test';
    private static final String MAX_count = 5;

    // Violation: Different access modifiers with violations
    public static final String publicConstant = 'public';
    protected static final String protectedConstant = 'protected';
    global static final String globalConstant = 'global';
    private static final String privateConstant = 'private';

    // Violation: Static but not final with different access modifiers
    public static String publicNotFinal = 'public';
    protected static Integer protectedNotFinal = 5;
    global static Boolean globalNotFinal = true;

    // Violation: Static variables in static classes (not final or wrong naming)
    public static class UtilityClass {
        public static String apiVersion = 'v1';  // Not final
        private static final String maxRetries = 3;  // Wrong naming
        protected static Integer baseUrl = 5;  // Not final
    }

    // Violation: Multiple violations in same class
    private static String firstViolation = 'first';
    private static final String secondViolation = 'second';  // Wrong naming
    private static Integer thirdViolation = 3;
}
