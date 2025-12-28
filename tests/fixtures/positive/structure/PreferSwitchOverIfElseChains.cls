public class Example {
    public void method(String value) {
        // Valid: Using switch statement
        switch on value {
            when 'a' {
                processA();
            }
            when 'b' {
                processB();
            }
            when 'c' {
                processC();
            }
        }

        // Valid: If-else with only 1 condition (not enough)
        if (value == 'a') {
            processA();
        } else {
            processB();
        }

        // Valid: Simple if-else
        Boolean condition = true;
        if (condition) {
            doSomething();
        } else {
            doOther();
        }

        // Valid: Different variables compared (not same variable)
        String otherValue = 'test';
        if (value == 'a') {
            processA();
        } else if (otherValue == 'b') {
            processB();
        } else if (value == 'c') {
            processC();
        }

        // Valid: Different operators (not all ==)
        if (value == 'a') {
            processA();
        } else if (value != 'b') {
            processB();
        } else if (value == 'c') {
            processC();
        }

        // Valid: Non-equality comparisons
        Integer num = 5;
        if (num > 0) {
            processA();
        } else if (num > 10) {
            processB();
        } else if (num > 20) {
            processC();
        }

        // Valid: Consecutive if statements comparing different variables
        String otherValue = 'test';
        if (value == 'a') {
            processA();
        }
        if (otherValue == 'b') {
            processB();
        }

        // Valid: Single if statement (not enough for violation)
        if (value == 'a') {
            processA();
        }

        // Valid: OR condition with different variables (not same variable)
        String otherValue = 'test';
        if (value == 'a' || otherValue == 'b') {
            processAB();
        }

        // Valid: OR condition with only 1 comparison (not enough for violation)
        if (value == 'a') {
            processA();
        }

        // Valid: OR condition with non-equality comparisons
        Integer num = 5;
        if (num > 0 || num < 10) {
            processNum();
        }
    }
}
