/**
 * Class description without prohibited tags
 */
public class ValidClass {
}

/**
 * Method description
 * @param value The input value
 * @return The result
 */
public String processValue(String value) {
	return value;
}

/**
 * Property description
 */
public String validProperty { get; set; }

/**
 * Method with @group tag
 * @group Method
 */
public void validMethod() {
}

/**
 * Class with @group and @description
 * @group Class
 * @description This is a valid class
 */
public class ValidClassWithGroup {
}

/**
 * Method with multiple valid tags
 * @param input The input parameter
 * @param threshold The threshold value
 * @return The processed result
 * @throws IllegalArgumentException if input is null
 */
public String complexMethod(String input, Integer threshold) {
	if (input == null) {
		throw new IllegalArgumentException('Input cannot be null');
	}
	return input + threshold;
}

