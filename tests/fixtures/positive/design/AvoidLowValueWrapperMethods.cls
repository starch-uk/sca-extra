public class Example {
    // Valid: Method with additional logic
    public Boolean isString(Object obj) {
        if (obj == null) {
            return false;
        }
        return obj instanceof String;
    }

    // Valid: Method with more than just instanceof
    public String processObject(Object obj) {
        if (obj instanceof String) {
            return (String) obj;
        }
        return null;
    }
}

