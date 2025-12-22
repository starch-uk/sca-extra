public class Example {
    // Violation: Method that only wraps instanceof check
    public Boolean isString(Object obj) {
        return obj instanceof String;
    }

    // Violation: Method that only wraps instanceof check
    public Boolean isInteger(Object obj) {
        return obj instanceof Integer;
    }
}

