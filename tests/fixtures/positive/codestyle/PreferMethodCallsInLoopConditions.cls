public class Example {
    public void testMethod() {
        // Valid: Method call in loop condition
        while (hasMore()) {
            process();
        }

        // Valid: Method call in do-while condition
        do {
            process();
        } while (hasMore());

        // Valid: Break without method call condition
        while (true) {
            if (flag) {
                break;
            }
            process();
        }

        // Valid: Break without method call in do-while
        do {
            if (flag) {
                break;
            }
            process();
        } while (true);
    }
}

