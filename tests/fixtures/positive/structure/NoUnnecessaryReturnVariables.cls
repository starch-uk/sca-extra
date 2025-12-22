public class Example {
    public String method1() {
        // Valid: Direct return
        return calculate();
    }

    public Integer method2() {
        // Valid: Variable used before return
        Integer value = process();
        log(value);
        return value;
    }

    public String method3() {
        // Valid: Variable modified before return
        String result = getValue();
        result = result + ' suffix';
        return result;
    }
}

