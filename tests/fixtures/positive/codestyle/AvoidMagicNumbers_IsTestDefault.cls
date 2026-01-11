@IsTest
private class TestClassWithDefaultSeeAllData {
    static void testSomeMethod() {
        // Valid: Magic numbers are allowed in test classes (SeeAllData defaults to false)
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