public class Example {
    // Violation: Static but not final
    private static String notFinal = 'value';

    // Violation: Static final but not SCREAMING_SNAKE_CASE
    private static final String camelCase = 'value';

    // Violation: Static final but lowercase
    private static final String lowercase = 'value';

    // Violation: Static final but mixed case
    private static final String Mixed_Case = 'value';
}

