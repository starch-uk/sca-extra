// Valid: Code with normal annotations (not @SuppressWarnings)
@TestSetup
public class Example5 {
    @Test
    public void testMethod() {
        int value = 42;
        System.assert(value > 0);
    }
}

