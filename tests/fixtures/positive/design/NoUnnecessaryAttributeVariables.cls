public class Example {
    public void method() {
        Account acc = getAccount();

        // Valid: Variable used multiple times
        String name = acc.Name;
        process(name);
        log(name);

        // Valid: Variable reassigned
        Integer count = acc.NumberOfEmployees;
        count = count + 1;
        return count;

        // Valid: Collection type (excluded)
        List<Contact> contacts = acc.Contacts;
        process(contacts);

        // Valid: Object type (excluded)
        Account parent = acc.Parent;
        process(parent);
    }
}

