public class Example {
    public void method() {
        String str = 'test';
        if (str.contains('a') || str.contains('b') || str.contains('c')) {
            // Should violate with minCalls=3
        }
    }
}
