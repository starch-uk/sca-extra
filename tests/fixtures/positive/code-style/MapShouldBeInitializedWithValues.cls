public class Example {
    public void testMethod() {
        // Valid: Map initialized with values
        Map<String, String> map1 = new Map<String, String>{
            'key1' => 'value1'
        };

        // Valid: Map initialized with multiple values
        Map<String, Integer> map2 = new Map<String, Integer>{
            'a' => 1,
            'b' => 2
        };

        // Valid: Put called later (not immediately after creation)
        Map<String, String> map3 = new Map<String, String>();
        // ... other code ...
        map3.put('key', 'value');
    }
}

