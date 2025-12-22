public class Example {
  public void invalidMethod() {
    Integer value = 5;
    // Violation: variable is never reassigned, should be final

    String name = 'test';
    // Violation: variable is never reassigned, should be final

    Boolean isValid = true;
    if (isValid) {
      // Violation: variable is never reassigned, should be final
    }

    Integer count = getCount();
    // Violation: variable is never reassigned, should be final
  }

  private Integer getCount() {
    return 10;
  }
}

