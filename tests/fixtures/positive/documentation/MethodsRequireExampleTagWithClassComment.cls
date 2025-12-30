/**
 * Utility class for data operations.
 * Supports multiple formats.
 */
public with sharing class MethodsRequireExampleTagWithClassComment {
    // Valid: Method with @example and {@code} block, even with class-level comment
    /**
     * Retrieves data for a given name.
     * @param name The name to filter by
     * @return List of records
     * @example
     * {@code
     * List<Record> records = MethodsRequireExampleTagWithClassComment.getData('Test');
     * }
     */
    public static List<Record> getData(String name) {
        return new List<Record>();
    }

    // Valid: Method with @example and {@code} block with multiple lines
    /**
     * Exports data in a specific format.
     * @param name The name to filter by
     * @return Formatted string
     * @example
     * {@code
     * String result = MethodsRequireExampleTagWithClassComment.exportData('Test');
     * System.debug(result);
     * }
     */
    public static String exportData(String name) {
        return 'Data';
    }
}

