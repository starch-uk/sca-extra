public class Example {
    /** Comment before @IsTest annotation - violation */
    @IsTest
    static void testMethod() {
    }

    /** Comment before @SuppressWarnings - violation */
    @SuppressWarnings('PMD')
    public void method() {
    }
}

