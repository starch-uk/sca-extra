public class Example {
    public void method() {
        // Violation: Reassigning builder variable instead of chaining
        Builder builder = new Builder();
        Builder builder1 = builder.setName('John');
        Builder builder2 = builder.setAge(30);
        Builder builder3 = builder.setEmail('john@example.com');
        builder3.build();

        // Violation: Multiple assignments to same variable
        QueryBuilder qb = new QueryBuilder();
        qb = qb.select('Name');
        qb = qb.from('Account');
        qb = qb.where('Id = :id');
    }
}

