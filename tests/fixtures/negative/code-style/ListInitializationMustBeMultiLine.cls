public class Example {
    public void testMethod() {
        // Violation: List with 2+ items on same line
        List<String> items = new List<String>{ 'item1', 'item2' };

        // Violation: List with 3 items on same line
        List<Integer> numbers = new List<Integer>{ 1, 2, 3 };

        // Violation: List with multiple items on same line
        List<Object> objects = new List<Object>{ obj1, obj2, obj3, obj4 };
    }
}

