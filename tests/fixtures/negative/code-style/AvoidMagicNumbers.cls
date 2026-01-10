public class Example {
    public void method() {
        // Violation: Magic numbers in calculations
        Integer total = price * 1.15;  // What is 1.15?
        Integer timeout = 30000;  // What is 30000?
        Decimal discount = amount * 0.10;  // What is 0.10?
        
        // Violation: Magic numbers in method calls
        setMaxRetries(3);
        setBatchSize(200);
        setPageSize(50);
        
        // Violation: Magic numbers in assignments
        Integer maxRetries = 3;
        Integer batchSize = 200;
        Integer pageSize = 50;
        
        // Violation: Magic numbers in conditions (not safe numbers)
        if (count > 5) { }  // 5 is not a safe number
        if (size >= 10) { }  // 10 is not a safe number
        if (value < 100) { }  // 100 is not a safe number
        
        // Violation: Magic numbers in arithmetic
        Integer result = baseValue * 2.5;
        Decimal percentage = value / 100.0;
        Long timestamp = System.now().getTime() + 86400000;  // What is 86400000?
    }
    
    // Violation: Magic numbers in return statements
    public Integer getDefaultTimeout() {
        return 5000;  // What is 5000?
    }
}

// Violation: Test classes without seeAllData=false should still flag magic numbers
@IsTest
private class TestClassWithoutSeeAllDataFalse {
    @IsTest
    static void testMethod() {
        // Magic numbers should still be flagged in regular test classes
        Integer batchSize = 200;  // Violation: What is 200?
        Decimal taxRate = 0.08;   // Violation: What is 0.08?
        Account acc = new Account(AnnualRevenue = 50000); // Violation: What is 50000?
        System.assertEquals(3, records.size()); // Violation: What is 3?
        Integer timeout = 30000;  // Violation: What is 30000?
        Decimal discount = amount * 0.10;  // Violation: What is 0.10?
    }
}
