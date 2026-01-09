public class Example {
    // Valid: Property syntax
    public String name { get; set; }

    // Valid: Property with getter
    public Integer count { get; private set; }

    private String value;

    // Valid: Getter with logic
    public String getValue() {
        return value != null ? value : 'default';
    }

    // Valid: Getter with method calls
    public String getName() {
        return formatName(name);
    }

    private String status;

    // Valid: Getter with IfBlockStatement (excluded from rule)
    public String getStatus() {
        if (status == null) {
            return 'Unknown';
        }
        return status;
    }
}

