public class Example {
    public void testMethod() {
        // Violation: while(true) with break inside
        while (true) {
            if (!hasMore()) {
                break;
            }
            process();
        }

        // Violation: while(false) with break inside
        while (false) {
            if (shouldStop()) {
                break;
            }
            doWork();
        }
    }
}

