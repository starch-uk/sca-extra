public class Example {
    // Valid: Basic static final with SCREAMING_SNAKE_CASE
    private static final String CONSTANT_VALUE = 'value';

    // Valid: Static final with numbers
    private static final Integer MAX_RETRY_COUNT = 3;
    private static final Integer MAX_SIZE_2X = 200;
    private static final String API_V2_ENDPOINT = '/api/v2';
    private static final String CONFIG_KEY_1 = 'key1';

    // Valid: Static final with underscores
    private static final String API_KEY_NAME = 'key';
    private static final String USER_NAME_FIELD = 'Name';
    private static final Integer MAX_RETRY_COUNT_LIMIT = 10;

    // Valid: Static final with all caps
    private static final Boolean IS_ENABLED = true;
    private static final Boolean HAS_PERMISSION = false;

    // Valid: Different access modifiers
    public static final String PUBLIC_CONSTANT = 'public';
    protected static final String PROTECTED_CONSTANT = 'protected';
    global static final String GLOBAL_CONSTANT = 'global';
    private static final String PRIVATE_CONSTANT = 'private';

    // Valid: Different data types
    private static final Integer MAX_COUNT = 100;
    private static final Long MAX_SIZE = 1000L;
    private static final Decimal MAX_AMOUNT = 1000.50;
    private static final Double MAX_RATIO = 0.95;
    private static final Boolean IS_ACTIVE = true;
    private static final Date START_DATE = Date.today();
    private static final DateTime CREATED_AT = DateTime.now();
    private static final String STATUS = 'ACTIVE';
    private static final Id RECORD_ID = null;

    // Valid: Single uppercase letter (edge case)
    private static final String A = 'a';
    private static final Integer X = 1;
    private static final Boolean Y = true;

    // Valid: Multiple underscores
    private static final String API__VERSION__V2 = 'v2';
    private static final Integer MAX__RETRY__COUNT = 5;

    // Valid: Static variables in static classes
    public static class UtilityClass {
        public static final String API_VERSION = 'v1';
        private static final Integer MAX_RETRIES = 3;
        protected static final String BASE_URL = 'https://api.example.com';
    }

    // Valid: Static final variable initialized in static block
    private static final String INITIALIZED_CONSTANT;
    private static final Integer INITIALIZED_COUNT;
    static {
        INITIALIZED_CONSTANT = 'initialized';
        INITIALIZED_COUNT = 42;
    }

    // Valid: Multiple static final variables in same class
    private static final String FIRST_CONSTANT = 'first';
    private static final String SECOND_CONSTANT = 'second';
    private static final String THIRD_CONSTANT = 'third';

    // Valid: Complex constant names
    private static final String HTTP_STATUS_CODE_OK = '200';
    private static final Integer MAX_CONCURRENT_REQUESTS = 10;
    private static final String DEFAULT_TIMEZONE_UTC = 'UTC';
    private static final Boolean ENABLE_DEBUG_LOGGING = false;
}
