public class Example {
    /**
     * Method that throws exception without throws annotation
     */
    public void method1() {
        throw new CustomException('Error');
    }

    /**
     * Method with ApexDoc including @throws
     * @param value The input value to process
     * @param threshold The threshold value
     * @return The processed result
     * @throws IllegalArgumentException when value is null
     * @throws CustomException when threshold is negative
     */
    public String method2(String value, Integer threshold) {
        if (value == null) {
            throw new IllegalArgumentException('Value cannot be null');
        }
        if (threshold < 0) {
            throw new CustomException('Threshold must be positive');
        }
        return value + threshold;
    }
}

