public class Example {
    @IsTest
    /** Comment after annotation - valid */
    static void testMethod() {
    }

    @SuppressWarnings('PMD')
    /** Comment after annotation - valid */
    public void method() {
    }

    @IsTest
    static void testMethod2() {
        // No comment - valid
    }
}

