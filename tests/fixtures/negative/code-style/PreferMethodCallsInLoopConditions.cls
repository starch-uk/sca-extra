public class Example {
    public void method() {
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

        // Violation: do-while(true) with break inside
        do {
            if (!hasMore()) {
                break;
            }
            process();
        } while (true);

        // Violation: do-while(false) with break inside
        do {
            if (shouldStop()) {
                break;
            }
            doWork();
        } while (false);
    }
}

