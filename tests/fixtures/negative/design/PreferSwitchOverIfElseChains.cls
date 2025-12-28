public class Example {
    public void method() {
        // Violation: If-else chain with 2+ conditions comparing same variable
        String val1 = 'a';
        if (val1 == 'a') {
            processA();
        } else if (val1 == 'b') {
            processB();
        }

        // Violation: If-else chain with 3+ conditions comparing same variable
        if (val2 == 'a') {
            processA();
        } else if (val2 == 'b') {
            processB();
        } else if (val2 == 'c') {
            processC();
        }

        // Violation: If-else chain with else, comparing same variable
        Integer val3 = 1;
        if (val3 == 1) {
            doOne();
        } else if (val3 == 2) {
            doTwo();
        } else if (val3 == 3) {
            doThree();
        } else {
            doOther();
        }

        // Violation: Consecutive if statements comparing same variable
        String val4 = 'a';
        if (val4 == 'a') {
            processA();
        }
        if (val4 == 'b') {
            processB();
        }

        // Violation: Three consecutive if statements comparing same variable
        String val5 = 'x';
        if (val5 == 'x') {
            processX();
        }
        if (val5 == 'y') {
            processY();
        }
        if (val5 == 'z') {
            processZ();
        }

        // Violation: OR condition with 2+ comparisons to same variable
        String val6 = 'a';
        if (val6 == 'a' || val6 == 'b') {
            processAB();
        }

        // Violation: OR condition with 3+ comparisons to same variable
        String val7 = 'x';
        if (val7 == 'x' || val7 == 'y' || val7 == 'z') {
            processXYZ();
        }

        // Violation: OR condition with 5+ comparisons to same variable
        String val8 = 'a';
        if (val8 == 'a' || val8 == 'b' || val8 == 'c' || val8 == 'd' || val8 == 'e') {
            processABCDE();
        }
    }
}

