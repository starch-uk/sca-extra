public class Example {
    public void method() {
        String str = 'test';
        if (str.contains('a') || str.contains('b')) {
            // Should not violate with minCalls=3
        }
    }
}
