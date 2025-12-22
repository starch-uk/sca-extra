public class Example {
    public void method() {
        Account acc = getAccount();

        // Violation: Variable only used once, never reassigned
        String name = acc.Name;
        process(name);

        // Violation: Integer attribute variable used once
        Integer count = acc.NumberOfEmployees;
        return count;

        // Violation: Boolean attribute variable used once
        Boolean isActive = acc.IsActive;
        if (isActive) {
            // ...
        }
    }
}

