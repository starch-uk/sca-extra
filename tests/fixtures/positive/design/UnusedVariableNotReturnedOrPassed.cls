public class Example {
    public String method1() {
        // Valid: Variable returned
        String result = 'test';
        return result;
    }

    public void method2() {
        // Valid: Variable passed to method
        String value = 'test';
        process(value);
    }

    public void method3() {
        // Valid: Variable passed to constructor with named parameters
        String name = 'Test';
        Account acc = new Account(Name = name);
        process(acc);  // acc is passed to method
    }

    public Account method4() {
        // Valid: Variable passed to constructor with positional parameters
        String name = 'Test';
        Account acc = new Account(name);
        return acc;  // acc is returned
    }

    public void method5() {
        // Valid: Variable used in multiple ways
        String value = 'test';
        process(value);
        log(value);
    }

    public void method6() {
        // Valid: Variable returned after being used
        String result = 'test';
        process(result);
        return result;
    }

}
