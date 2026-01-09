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

    Decimal total = 100.0;
    // Violation: variable is never reassigned, should be final

    String message = 'Hello';
    System.debug(message);
    // Violation: variable is never reassigned, should be final

    Integer result = calculate();
    if (result > 0) {
      // Violation: variable is never reassigned, should be final
    }
  }

  private Integer getCount() {
    return 10;
  }

  private Integer calculate() {
    return 42;
  }

  public void methodWithNestedBlocks() {
    Integer outer = 1;
    // Violation: variable is never reassigned, should be final

    if (true) {
      Integer inner = 2;
      // Violation: variable is never reassigned, should be final
      System.debug(inner);
    }

    System.debug(outer);
  }
}

