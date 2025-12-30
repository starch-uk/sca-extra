public class MethodsRequireExampleTagWithOrphanedComment {
    // Violation: Method with orphaned comment and no @example tag
    /**
     * Orphaned comment without a method (this comment is associated with the next method).
     * @param value Some value
     * @return Some result
     */
    
    /**
     * Processes data for a given input.
     * @param input The input to process
     * @return Processed result
     */
    public static String process(String input) {
        return input;
    }
}

