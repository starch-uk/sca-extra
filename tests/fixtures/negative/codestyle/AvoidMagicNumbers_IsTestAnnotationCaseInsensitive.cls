@ISTEST(SeeAllData=true)
private class TestClassAnnotationUpperCaseShouldFail {
    static void testSomeMethod() {
        // Should be flagged because SeeAllData=true, even with case insensitive annotation
        Integer value = 111;
        Decimal rate = 0.05;
    }
}