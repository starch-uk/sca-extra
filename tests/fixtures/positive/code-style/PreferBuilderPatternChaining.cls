public class Example {
    public void testMethod() {
        // Valid: Method chaining
        Builder builder = new Builder()
            .setName('John')
            .setAge(30)
            .setEmail('john@example.com')
            .build();

        // Valid: Final variable with chaining
        final QueryBuilder qb = new QueryBuilder()
            .select('Name')
            .from('Account')
            .where('Id = :id');

        // Valid: Assignment in constructor (excluded)
        public MyClass() {
            this.builder = new Builder();
            this.builder = this.builder.setName('Test');
        }
    }
}

