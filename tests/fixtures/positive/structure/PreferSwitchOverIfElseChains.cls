public class Example {
    public void testMethod(String value) {
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

        // Valid: If-else with only 2 conditions (not enough)
        if (value == 'a') {
            processA();
        } else if (value == 'b') {
            processB();
        }

        // Valid: Simple if-else
        if (condition) {
            doSomething();
        } else {
            doOther();
        }
    }
}

