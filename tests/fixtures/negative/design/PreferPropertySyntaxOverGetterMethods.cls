public class Example {
    private String name;

    // Violation: Public getter for private field
    public String getName() {
        return name;
    }

    private Integer count;

    // Violation: Getter returning field directly
    public Integer getCount() {
        return count;
    }
}

