public class MethodsRequireExampleTag {
    // Violation: Method with ApexDoc but no @example tag
    /**
     * Processes the account.
     * @param acc The account to process
     * @return The processed account
     */
    public Account processAccount(Account acc) {
        return acc;
    }

    // Violation: Method with ApexDoc but missing @example
    /**
     * Calculates the total value.
     * @param items List of items
     * @return Total as Decimal
     */
    public Decimal calculateTotal(List<Item> items) {
        Decimal total = 0;
        for (Item item : items) {
            total += item.getAmount();
        }
        return total;
    }

    // Violation: Method with only description, no @example
    /**
     * Validates the input data.
     */
    public Boolean validate(String input) {
        return String.isNotBlank(input);
    }

    // Violation: Method with @param and @return but no @example
    /**
     * Reverses the given string.
     * @param input The string to reverse
     * @return The reversed string
     */
    public String reverse(String input) {
        if (input == null) {
            return null;
        }
        return input.reverse();
    }

    // Violation: Method with @throws but no @example
    /**
     * Processes data with validation.
     * @param data The data to process
     * @throws IllegalArgumentException if data is null
     */
    public void processData(String data) {
        if (data == null) {
            throw new IllegalArgumentException('Data cannot be null');
        }
    }

    // Violation: Private method with ApexDoc but no @example
    /**
     * Internal helper method.
     * @param value The value to process
     * @return Processed value
     */
    private Integer helperMethod(Integer value) {
        return value * 2;
    }

    // Violation: Static method with ApexDoc but no @example
    /**
     * Utility method for formatting.
     * @param input Input string
     * @return Formatted string
     */
    public static String format(String input) {
        return input.trim().toLowerCase();
    }

    // Violation: @example tag without {@code} block
    /**
     * Processes the account.
     * @param acc The account to process
     * @example
     * Account acc = new Account(Name = 'Test');
     */
    public Account processAccount(Account acc) {
        return acc;
    }

    // Violation: @example tag without {@code} block (multiple examples)
    /**
     * Processes data in different ways.
     * @param input Input string
     * @example
     * String result1 = processor.process('input1');
     * @example
     * String result2 = processor.process('input2');
     */
    public String process(String input) {
        return input;
    }

    // Violation: @example tag with @code but without curly braces (should be {@code})
    /**
     * Retrieves data for a given name.
     * @param name The name to filter by
     * @return List of records
     * @example
     * @code
     * List<Record> records = MethodsWithIncorrrectCodeBlocks.getData('Test');
     */
    public static List<Record> getData(String name) {
        return new List<Record>();
    }

    // Violation: @example tag with {@code but missing closing curly brace
    /**
     * Processes data for a given input.
     * @param input The input to process
     * @return Processed result
     * @example
     * {@code
     * String result = MethodsRequireExampleTag.process('input');
     */
    public static String process(String input) {
        return input;
    }
}

