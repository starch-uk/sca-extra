/**
 * Class with @author tag
 * @author John Doe
 */
public class ClassWithAuthor {
	/**
	 * Method with @since tag
	 * @since 2024-01-15
	 */
	public void methodWithSince() {
	}

	/**
	 * Property with @version tag
	 * @version 1.0.0
	 */
	public String propertyWithVersion { get; set; }

	/**
	 * Inner class with multiple prohibited tags
	 * @author Jane Smith
	 * @since 2024-01-01
	 * @version 2.0.0
	 */
	public class InnerClassWithMultipleTags {
	}

	/**
	 * Method with @author and valid tags
	 * @author John Doe
	 * @param value The input value
	 * @return The result
	 */
	public String methodWithAuthorAndValid(String value) {
		return value;
	}

	/**
	 * Inner class with @since tag
	 * @since 2024-02-01
	 */
	public class InnerClassWithSince {
	}

	/**
	 * Method with @version tag
	 * @version 1.5.0
	 */
	public void methodWithVersion() {
	}
}

