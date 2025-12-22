public class Example {
    public void testMethod() {
        // Valid: Method call in loop condition
        while (hasMore()) {
            process();
        }

        // Valid: Break without method call condition
        while (true) {
            if (flag) {
                break;
            }
            process();
        }
    }
}

