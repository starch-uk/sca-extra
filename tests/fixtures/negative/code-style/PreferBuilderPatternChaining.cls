public class Example {
    public void testMethod() {
        // Violation: Reassigning builder variable instead of chaining
        Builder builder = new Builder();
        builder = builder.setName('John');
        builder = builder.setAge(30);
        builder = builder.setEmail('john@example.com');
        builder.build();

        // Violation: Multiple assignments to same variable
        QueryBuilder qb = new QueryBuilder();
        qb = qb.select('Name');
        qb = qb.from('Account');
        qb = qb.where('Id = :id');
    }
}

