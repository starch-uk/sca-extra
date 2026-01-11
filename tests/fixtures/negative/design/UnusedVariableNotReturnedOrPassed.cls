public class Example {
    public void method1() {
        // Violation: Variable assigned but never returned or passed
        String unused = 'test';
    }

    public void method2() {
        // Violation: Variable assigned but not used
        Integer value = 42;
        String other = 'hello';
    }

    public void method3() {
        // Violation: Variable assigned but never returned or passed
        String copy = 'Test';
        // copy is never used
    }

    public void method4() {
        // Violation: Variable assigned after being used but not returned or passed
        String value = 'test';
        process(value);
        value = 'test2';  // Variable is assigned but not returned or passed
    }

    public void method5() {
        // Violation: Variable incremented but not returned or passed
        Integer value = 0;
        process(value);
        value++;  // Variable incremented but not returned or passed
    }

    public void method6() {
        // Violation: Variable decremented but not returned or passed
        Integer value = 0;
        process(value);
        value--;  // Variable decremented but not returned or passed
    }

    public void method7() {
        // Violation: Variable assigned after being used in constructor but not returned or passed
        String name = 'test';
        Account acc = new Account(Name = name);
        name = 'test2';  // Variable used in constructor is assigned but not returned or passed
    }

    public void method8() {
        // Violation: Variable incremented but not returned or passed (after being used in constructor)
        Integer value = 0;
        Account acc = new Account(NumberOfEmployees = value);
        value++;  // Variable used in constructor is incremented but not returned or passed
    }

    public void method9() {
        // Violation: Variable decremented but not returned or passed (after being used in constructor)
        Integer value = 0;
        Account acc = new Account(NumberOfEmployees = value);
        value--;  // Variable used in constructor is decremented but not returned or passed
    }
}
