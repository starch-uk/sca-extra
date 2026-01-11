@IsTest(seeAllData=true)
public class TestWithSeeAllData {
    @IsTest
    static void testMethod() {
        // Valid: Exempt from IsParallel requirement due to seeAllData=true
        // Tests with seeAllData=true cannot run in parallel due to data contention issues
        List<Account> accounts = [SELECT Id FROM Account LIMIT 1];
        System.assertNotEquals(null, accounts);
    }
}

