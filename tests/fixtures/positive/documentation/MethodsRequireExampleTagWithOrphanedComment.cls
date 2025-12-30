public class MethodsRequireExampleTagWithOrphanedComment {
    // Valid: Method with @example and {@code} block, even when there's an orphaned comment before it
    /**
     * Orphaned comment without a method (this comment is associated with the next method).
     * @param value Some value
     * @return Some result
     */
    
    /**
     * Processes data for a given input.
     * @param input The input to process
     * @return Processed result
     * @example
     * {@code
     * String result = MethodsRequireExampleTagWithOrphanedComment.process('input');
     * }
     */
    public static String process(String input) {
        return input;
    }
}

