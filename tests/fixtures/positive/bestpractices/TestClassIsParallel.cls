@IsTest(IsParallel=true)
public class MyTestClass {
    @IsTest
    static void testValidOperations() {
        // Valid: Can use other methods
        String result = String.valueOf(123);
        
        // Valid: Can insert other SObjects
        Account acc = new Account(Name = 'Test');
        insert acc;
        
        // Valid: Can query existing records
        List<User> users = [SELECT Id FROM User LIMIT 1];
        
        // Valid: Can use other System methods
        System.debug('Test');
    }
}
