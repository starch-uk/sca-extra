public class Example {
    public void testMethod() {
        // Valid: Single argument on one line
        processData(getValue());

        // Valid: Zero arguments on one line
        processData();

        // Valid: Multiple arguments can be multi-line
        processData(
            getValue1(),
            getValue2()
        );
    }
}

