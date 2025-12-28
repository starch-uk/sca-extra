public class Example {
    private String name;
    private Integer value;

    public Example(String name, Integer value) {
        this.name = name; // Valid in constructor
        this.value = value; // Valid in constructor
    }

    public void method1() {
        // Violation: Using this. outside constructor
        String n = this.name;
    }

    public void method2() {
        // Violation: Using this. outside constructor
        this.value = 10;
    }

    public void method3() {
        // Violation: Using this. in method call
        processData(this.name);
    }
}

