public class Example {
    public String method1() {
        // Violation: Variable immediately before return
        String result = calculate();
        return result;
    }

    public Integer method2() {
        // Violation: Return variable right before return
        Integer value = process();
        return value;
    }
}

