public class Example {
    // Violation: One-liner method with single statement
    public String getName(String id) {
        return 'Name';
    }

    // Violation: One-liner method with single return
    public Integer calculate(Integer a, Integer b) {
        return a + b;
    }

    // Violation: One-liner method with single assignment
    public void setValue(String value) {
        this.value = value;
    }

    // Violation: One-liner method with single method call
    public void process(String data) {
        processData(data);
    }
}

