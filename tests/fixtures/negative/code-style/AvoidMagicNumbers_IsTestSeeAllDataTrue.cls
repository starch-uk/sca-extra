@IsTest(SeeAllData=true)
private class TestClassWithSeeAllDataTrue {
    static void testSomeMethod() {
        // Violation: Magic numbers should still be flagged in test classes with SeeAllData=true
        Integer batchSize = 200;  // What is 200?
        Decimal taxRate = 0.08;   // What is 0.08?
        Account acc = new Account(AnnualRevenue = 50000); // What is 50000?
        System.assertEquals(3, records.size()); // What is 3?
        Integer timeout = 30000;  // What is 30000?
        Decimal discount = amount * 0.10;  // What is 0.10?
    }
}