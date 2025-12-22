public class Example {
    /**
     * Method that throws exception with @throws documentation
     * @throws CustomException when error occurs
     */
    public void method1() {
        throw new CustomException('Error');
    }

    /**
     * Method with @exception documentation
     * @exception IllegalArgumentException when condition is invalid
     */
    public void method2() {
        if (condition) {
            throw new IllegalArgumentException('Invalid');
        }
    }

    /**
     * Method without ApexDoc - not checked
     */
    public void method3() {
        throw new CustomException('Error');
    }

    /**
     * Method that doesn't throw exceptions
     */
    public void method4() {
        // No throw statement
    }

    /**
     * Method with ApexDoc including @throws for multiple exceptions
     * @param value The input value to process
     * @param threshold The threshold value
     * @return The processed result
     * @throws IllegalArgumentException when value is null
     * @throws CustomException when threshold is negative
     */
    public String method5(String value, Integer threshold) {
        if (value == null) {
            throw new IllegalArgumentException('Value cannot be null');
        }
        if (threshold < 0) {
            throw new CustomException('Threshold must be positive');
        }
        return value + threshold;
    }
}

