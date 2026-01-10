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
