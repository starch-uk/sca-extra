public class Example {
    public void testMethod() {
        // Valid: Single entry map can be on one line
        Map<String, String> singleEntry = new Map<String, String>{ 'key1' => 'value1' };

        // Valid: Multi-line map with 2+ entries
        Map<String, String> map1 = new Map<String, String>{
            'key1' => 'value1',
            'key2' => 'value2'
        };

        // Valid: Empty map
        Map<String, String> empty = new Map<String, String>();
    }
}

