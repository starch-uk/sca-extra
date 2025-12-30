public class MethodsRequireExampleTagWithCodeBlock {
    // Valid: Method with @example tag containing {@code} block (verifies fix for curly braces issue)
    /**
     * Retrieves data for a given name.
     * @param name The name to filter by
     * @return List of records
     * @example
     * {@code
     * List<Record> records = MethodsRequireExampleTagWithCodeBlock.getData('Test');
     * }
     */
    public static List<Record> getData(String name) {
        return new List<Record>();
    }

    // Valid: Method with @example and {@code} with multiple lines
    /**
     * Exports data in a specific format.
     * @param name The name to filter by
     * @return Formatted string
     * @example
     * {@code
     * String result = MethodsRequireExampleTagWithCodeBlock.exportData('Test');
     * System.debug(result);
     * }
     */
    public static String exportData(String name) {
        return 'Data';
    }

    // Valid: Method with @example and {@code} containing complex example
    /**
     * Processes and transforms data.
     * @param input Input data
     * @return Processed result
     * @example
     * {@code
     * String input = 'test';
     * String output = MethodsRequireExampleTagWithCodeBlock.process(input);
     * }
     */
    public static String process(String input) {
        return input;
    }
}

