public class Example {
    // Valid: Abstract method (excluded)
    public abstract String getName();

    // Valid: Override method (excluded)
    public override String toString() {
        return 'Example';
    }

    // Valid: Interface method (excluded)
    public interface MyInterface {
        String getName();
    }

    // Valid: Method with multiple statements
    public String getName(String id) {
        String name = 'Name';
        return name;
    }

    // Valid: Overloaded method (excluded)
    public String getName() {
        return 'Name';
    }

    public String getName(String id) {
        return 'Name';
    }

    // Valid: Switch with multiple cases (excluded)
    public String getType(String value) {
        switch on value {
            when 'A' {
                return 'Type A';
            }
            when 'B' {
                return 'Type B';
            }
            when else {
                return 'Unknown';
            }
        }
    }

    // Valid: Method that updates class attribute (excluded)
    public void setValue(String value) {
        this.value = value;
    }

    // Valid: Method with parameter used multiple times (excluded)
    public void process(String data) {
        processData(data);
        logData(data);
    }
}

