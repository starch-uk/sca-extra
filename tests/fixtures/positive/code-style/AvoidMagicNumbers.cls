public class Example {
    // Valid: Constants defined at class level
    private static final Decimal TAX_RATE = 1.15;
    private static final Integer TIMEOUT_MS = 30000;
    private static final Decimal DISCOUNT_PERCENTAGE = 0.10;
    private static final Integer MAX_RETRIES = 3;
    private static final Integer BATCH_SIZE = 200;
    private static final Integer PAGE_SIZE = 50;
    private static final Integer DEFAULT_TIMEOUT = 5000;
    private static final Integer MAX_COUNT = 5;
    private static final Integer MIN_SIZE = 10;
    private static final Integer MAX_VALUE = 100;
    private static final Decimal MULTIPLIER = 2.5;
    private static final Decimal PERCENTAGE_DIVISOR = 100.0;
    private static final Long MILLISECONDS_PER_DAY = 86400000;
    
    public void method() {
        // Valid: Use named constants
        Integer total = price * TAX_RATE;
        Integer timeout = TIMEOUT_MS;
        Decimal discount = amount * DISCOUNT_PERCENTAGE;
        
        // Valid: Safe numbers (0, 1, -1) are allowed
        Integer count = 0;
        Integer index = 1;
        Integer offset = -1;
        
        // Valid: Array/list indices are allowed
        List<String> items = new List<String>();
        String first = items[0];
        String second = items[1];
        Integer value = array[2];
        
        // Valid: Loop conditions are allowed
        for (Integer i = 0; i < 10; i++) { }
        for (Integer j = 0; j < items.size(); j++) { }
        while (count < 100) { }
        do { } while (index < 5);
        
        // Valid: Comparisons with safe numbers (0, 1, -1) are allowed
        if (count == 0) { }
        if (size > 1) { }
        if (result != -1) { }
        if (value < 0) { }
        if (index >= 1) { }
        if (offset <= -1) { }
        
        // Valid: Using constants instead of magic numbers
        setMaxRetries(MAX_RETRIES);
        setBatchSize(BATCH_SIZE);
        setPageSize(PAGE_SIZE);
        
        Integer maxRetries = MAX_RETRIES;
        Integer batchSize = BATCH_SIZE;
        Integer pageSize = PAGE_SIZE;
        
        // Valid: Conditions with constants
        if (count > MAX_COUNT) { }
        if (size >= MIN_SIZE) { }
        if (value < MAX_VALUE) { }
        
        // Valid: Arithmetic with constants
        Integer result = baseValue * MULTIPLIER;
        Decimal percentage = value / PERCENTAGE_DIVISOR;
        Long timestamp = System.now().getTime() + MILLISECONDS_PER_DAY;
    }
    
    // Valid: Return statements with constants
    public Integer getDefaultTimeout() {
        return DEFAULT_TIMEOUT;
    }
}

// Valid: Test classes with @IsTest(seeAllData=false) are exempt from magic number rules
@IsTest(seeAllData=false)
private class TestClassWithSeeAllDataFalse {
    @IsTest
    static void testMethod() {
        // Magic numbers are allowed in test classes with seeAllData=false
        Integer batchSize = 200;  // ✅ Allowed
        Decimal taxRate = 0.08;   // ✅ Allowed
        Account acc = new Account(AnnualRevenue = 50000); // ✅ Allowed
        System.assertEquals(3, records.size()); // ✅ Allowed
        Integer timeout = 30000;  // ✅ Allowed
        Decimal discount = amount * 0.10;  // ✅ Allowed

        // Safe numbers still allowed (but not flagged anyway)
        Integer count = 0;
        Integer index = 1;
    }
}
