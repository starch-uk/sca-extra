public class Example {
    public void testMethod() {
        // Violation: Empty map followed by put()
        Map<String, String> map1 = new Map<String, String>();
        map1.put('key1', 'value1');

        // Violation: Empty map with multiple puts
        Map<String, Integer> map2 = new Map<String, Integer>();
        map2.put('a', 1);
        map2.put('b', 2);
    }
}

