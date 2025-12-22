@IsTest(IsParallel=true)
public class MyTestClass {
    // Valid: IsParallel=true specified
    @IsTest
    static void testMethod() {
    }
}

