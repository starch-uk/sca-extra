public class Example {
    public void testMethod() {
        // Valid: Single item list can be on one line
        List<String> singleItem = new List<String>{ 'item1' };

        // Valid: Multi-line list with 2+ items
        List<String> items = new List<String>{
            'item1',
            'item2'
        };

        // Valid: Multi-line list with 3+ items
        List<Integer> numbers = new List<Integer>{
            1,
            2,
            3
        };

        // Valid: Empty list
        List<String> empty = new List<String>();
    }
}

