@IsTest
public class MyTestClass {
    // Violation: Missing IsParallel=true
    @IsTest
    public static void testMethod() {
    }
}

