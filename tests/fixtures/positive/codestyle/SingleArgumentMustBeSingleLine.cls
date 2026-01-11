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

        // Valid: List declaration as argument (excluded from rule)
        processList(new List<String>{
            'item1',
            'item2'
        });

        // Valid: Map declaration as argument (excluded from rule)
        processMap(new Map<String, String>{
            'key1' => 'value1',
            'key2' => 'value2'
        });

        // Valid: Single item list as argument (excluded from rule)
        processList(new List<String>{
            'item1'
        });

        // Valid: Single entry map as argument (excluded from rule)
        processMap(new Map<String, String>{
            'key1' => 'value1'
        });

        // Valid: Empty list as argument (excluded from rule)
        processList(new List<String>());

        // Valid: Empty map as argument (excluded from rule)
        processMap(new Map<String, String>());

        // Valid: Builder pattern - single method call on new object (excluded from rule)
        ClassName classInstance = new ClassName()
            .withBuilderArg(2);

        // Valid: Builder pattern - multiple chained calls (excluded from rule)
        Builder builder = new Builder()
            .setName('John')
            .setAge(30)
            .setEmail('john@example.com');

        // Valid: Builder pattern - zero argument method call (excluded from rule)
        QueryBuilder qb = new QueryBuilder()
            .select('Name')
            .from('Account')
            .where('Id = :id');

        // Valid: Builder pattern - with different argument types (excluded from rule)
        ConfigBuilder config = new ConfigBuilder()
            .setString('key', 'value')
            .setInteger('count', 42)
            .setBoolean('enabled', true);

        // Valid: Builder pattern - nested builder (excluded from rule)
        OuterBuilder outer = new OuterBuilder()
            .withInner(new InnerBuilder()
                .setValue(10)
            );

        // Valid: Method chaining - method call on method result (excluded from rule)
        String result = getObject()
            .processValue(value);

        // Valid: Method chaining - multiple levels (excluded from rule)
        String chain = getFactory()
            .createObject()
            .getValue()
            .toString();

        // Valid: Builder pattern - with zero arguments (excluded from rule)
        SimpleBuilder simple = new SimpleBuilder()
            .initialize()
            .configure();

        // Valid: Builder pattern - final variable (excluded from rule)
        final FinalBuilder finalBuilder = new FinalBuilder()
            .setName('Test')
            .build();

        // Valid: Builder pattern - in assignment expression (excluded from rule)
        MyClass instance = new MyClass()
            .withParam(123);

        // Valid: Builder pattern - with method call that has no arguments (excluded from rule)
        ChainBuilder chainBuilder = new ChainBuilder()
            .start()
            .add('item')
            .finish();
    }
}

