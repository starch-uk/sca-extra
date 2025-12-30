public class MethodsRequireExampleTag {
    // Valid: Method with @example tag containing {@code} block
    /**
     * Processes the account.
     * @param acc The account to process
     * @return The processed account
     * @example
     * {@code
     * Account acc = new Account(Name = 'Test');
     * Account result = processor.processAccount(acc);
     * }
     */
    public Account processAccount(Account acc) {
        return acc;
    }

    // Valid: Method with annotation (exempt)
    /**
     * Test method for account processing.
     */
    @IsTest
    public static void testProcessAccount() {
        // Test code
    }

    // Valid: Method with multiple annotations (exempt)
    /**
     * Invocable method without @example.
     */
    @InvocableMethod(label = 'Process')
    @Future
    public static void invocableMethod() {
        // Method implementation
    }

    // Valid: Override method (exempt)
    /**
     * String representation.
     */
    @Override
    public String toString() {
        return 'Example';
    }

    // Valid: Override method with ApexDoc but no @example (exempt)
    /**
     * Equality check.
     * @param obj Object to compare
     * @return True if equal
     */
    @Override
    public Boolean equals(Object obj) {
        return true;
    }

    // Valid: Interface method declaration (exempt)
    public interface MyInterface {
        /**
         * Interface method without @example.
         */
        void doSomething();

        /**
         * Another interface method.
         * @param value Input value
         */
        String process(Integer value);
    }

    // Valid: Method with multiple @example tags containing {@code} blocks
    /**
     * Processes data in different ways.
     * @param input Input string
     * @param flag Processing flag
     * @return Processed result
     * @example
     * {@code
     * String result1 = processor.process('input1', false);
     * }
     * @example
     * {@code
     * String result2 = processor.process('input2', true);
     * }
     */
    public String process(String input, Boolean flag) {
        return input;
    }

    // Valid: Method with @example containing {@code} block
    /**
     * Calculates the total.
     * @param items List of items
     * @return Total amount
     * @example
     * {@code
     * List<Item> items = new List<Item>{ new Item(Amount = 10), new Item(Amount = 20) };
     * Decimal total = calculator.calculateTotal(items);
     * // total is 30
     * }
     */
    public Decimal calculateTotal(List<Item> items) {
        Decimal total = 0;
        for (Item item : items) {
            total += item.getAmount();
        }
        return total;
    }

    // Valid: Method with @example and other tags
    /**
     * Validates and processes input.
     * @param input Input to validate
     * @return Processed result
     * @throws IllegalArgumentException if input is invalid
     * @example
     * {@code
     * String result = validator.process('valid input');
     * }
     */
    public String process(String input) {
        if (String.isBlank(input)) {
            throw new IllegalArgumentException('Input cannot be blank');
        }
        return input.trim();
    }

    // Valid: Method without ApexDoc comment (not flagged by this rule)
    public void methodWithoutApexDoc() {
        // No ApexDoc comment
    }

    // Valid: Method with AuraEnabled annotation (exempt)
    /**
     * Aura enabled method.
     */
    @AuraEnabled
    public static String getData() {
        return 'Data';
    }

    // Valid: Method with custom annotation (exempt)
    /**
     * Method with custom annotation.
     */
    @MyCustomAnnotation
    public void customMethod() {
        // Implementation
    }

    // Valid: Constructor (exempt)
    /**
     * Creates a new instance.
     */
    public MethodsRequireExampleTag() {
        // Constructor implementation
    }

    // Valid: Constructor with parameters (exempt)
    /**
     * Creates a new instance with a name.
     * @param name The name
     */
    public MethodsRequireExampleTag(String name) {
        // Constructor implementation
    }

    // Valid: Void method with no parameters (exempt)
    /**
     * Initializes the instance.
     */
    public void initialize() {
        // Method implementation
    }

    // Valid: Void method with no parameters and no ApexDoc (exempt)
    public void reset() {
        // Method implementation
    }
}

