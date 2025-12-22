@IsTest(IsParallel=true)
public class MyTestClass {
    // Valid: IsParallel=true specified
    @IsTest
    public static void testMethod() {
    }
}

