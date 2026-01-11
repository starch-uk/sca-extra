@IsTest
public class TestWithRestrictedOperations {
    @IsTest
    static void testGetStandardPricebookId() {
        // Valid: Exempt from IsParallel requirement due to restricted operation
        Id pricebookId = Test.getStandardPricebookId();
    }

    @IsTest
    static void testSystemSchedule() {
        // Valid: Exempt from IsParallel requirement due to restricted operation
        System.schedule('Test', '0 0 0 * * ?', new TestSchedulable());
    }

    @IsTest
    static void testSystemEnqueueJob() {
        // Valid: Exempt from IsParallel requirement due to restricted operation
        System.enqueueJob(new TestQueueable());
    }

    @IsTest
    static void testInsertContentNote() {
        // Valid: Exempt from IsParallel requirement due to restricted operation
        ContentNote note = new ContentNote();
        insert note;
    }

    @IsTest
    static void testInsertUser() {
        // Valid: Exempt from IsParallel requirement due to restricted operation
        User u = new User();
        insert u;
    }

    @IsTest
    static void testInsertGroupMember() {
        // Valid: Exempt from IsParallel requirement due to restricted operation
        GroupMember gm = new GroupMember();
        insert gm;
    }
}
