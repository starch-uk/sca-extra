@IsTest
public class MyTestClass {
    // Violation: Missing IsParallel=true
    @IsTest
    static void testMethod() {
    }
}

