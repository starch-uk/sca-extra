public class Example {
    public void method(String value) {
        // Violation: If-else chain with 3+ conditions
        if (value == 'a') {
            processA();
        } else if (value == 'b') {
            processB();
        } else if (value == 'c') {
            processC();
        }

        // Violation: If-else chain with else
        if (x == 1) {
            doOne();
        } else if (x == 2) {
            doTwo();
        } else if (x == 3) {
            doThree();
        } else {
            doOther();
        }
    }
}

