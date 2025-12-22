public class Example {
    // Violation: Method that only wraps instanceof check
    public Boolean isString(Object obj) {
        return obj instanceof String;
    }

    // Violation: Method that only wraps instanceof check
    public Boolean isInteger(Object obj) {
        return obj instanceof Integer;
    }

    // Violation: Method that calls another method with the same arguments
    public Boolean otherMethod(Integer value, String name) {
        return OtherClass.otherMethod(value, name);
    }
}

