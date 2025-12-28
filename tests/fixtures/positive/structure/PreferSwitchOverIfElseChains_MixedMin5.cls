public class Example {
    public void method() {
        String value = 'foo';
        
        if (value == 'bar' || value == 'baz') {
            // 2 comparisons
        }
        
        if (value == 'apple') {
            // 1 comparison (total: 3)
        } else if (value == 'banana') {
            // 1 comparison (total: 4) - should NOT violate with minElseIfStatements=5
        }
    }
}

