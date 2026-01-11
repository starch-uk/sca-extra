@IsTest(SEEALLDATA=false)
private class TestClassUpperCase {
    static void testMethod() {
        // Should be allowed due to case insensitive matching
        Integer value = 123;
    }
}

@IsTest(SeeAllData=false)
private class TestClassPascalCase {
    static void testMethod() {
        // Should be allowed due to case insensitive matching
        Integer value = 456;
    }
}

@IsTest(seealldata=false)
private class TestClassLowerCase {
    static void testMethod() {
        // Should be allowed due to case insensitive matching
        Integer value = 789;
    }
}

@istest
private class TestClassAnnotationLowerCase {
    static void testMethod() {
        // Should be allowed due to case insensitive annotation name matching
        Integer value = 999;
    }
}