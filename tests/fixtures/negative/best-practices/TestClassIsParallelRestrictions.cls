@IsTest
public class TestWithoutParallel {
    @IsTest
    static void myTestMethod() {
        Account acc = new Account(Name = 'Test');
        insert acc;
    }
}

