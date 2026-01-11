public class Example {
    public void testMethod() {
        // Valid: Method call extracted to variable
        String value = getValue();
        processData(value);

        // Valid: Method call extracted to variable
        String data = getValue();
        String result = new String(data);

        // Valid: Method calls extracted to variables
        String value = getValue();
        String transformed = transformData(value);
        processData(transformed);
    }
}

