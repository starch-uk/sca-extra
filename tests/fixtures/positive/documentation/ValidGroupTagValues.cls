/**
 * @group Class
 */
public class ValidClass {
}

/**
 * @group Interface
 */
public interface ValidInterface {
}

/**
 * @group Enum
 */
public enum ValidEnum {
	VALUE1,
	VALUE2
}

public class MethodExample {
	/**
	 * @group Method
	 */
	public void validMethod() {
	}
}

public class PropertyExample {
	/**
	 * @group Property
	 */
	public String validProperty { get; set; }
}

public class VariableExample {
	/**
	 * @group Variable
	 */
	public String validVariable;
}

/**
 * Class with @group and additional content
 * @group Class
 * Additional description here
 */
public class ClassWithAdditionalContent {
}

/**
 * Method with @group and params
 * @group Method
 * @param input The input value
 * @return The result
 */
public String methodWithParams(String input) {
	return input;
}

