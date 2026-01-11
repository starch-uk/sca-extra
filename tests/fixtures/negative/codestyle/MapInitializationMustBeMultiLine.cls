public class Example {
    public void method() {
        // Violation: Map with 2+ entries on same line
        Map<String, String> map1 = new Map<String, String>{ 'key1' => 'value1', 'key2' => 'value2' };

        // Violation: Map with 3 entries on same line
        Map<String, Integer> map2 = new Map<String, Integer>{ 'a' => 1, 'b' => 2, 'c' => 3 };
    }
}

