public class Example {
    private String name;
    private Integer value;

    public Example(String name, Integer value) {
        // Valid: Using this. in constructor
        this.name = name;
        this.value = value;
    }

    public void method1() {
        // Valid: Accessing attribute without this.
        String n = name;
    }

    public void method2() {
        // Valid: Setting attribute without this.
        value = 10;
    }

    public Example method3() {
        // Valid: Returning this (fluent interface)
        return this;
    }
}

