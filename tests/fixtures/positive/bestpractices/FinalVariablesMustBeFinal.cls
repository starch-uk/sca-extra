public class Example {
  public void validMethod() {
    final Integer value = 5;
    // Valid: variable is declared as final

    final String name = 'test';
    // Valid: variable is declared as final

    Integer counter = 0;
    counter++;
    // Valid: variable is reassigned, so not final

    Integer result = 10;
    result = result + 5;
    // Valid: variable is reassigned, so not final

    Integer sum = 0;
    sum += 5;
    // Valid: variable is modified with compound assignment, so not final

    Integer product = 1;
    product *= 2;
    // Valid: variable is modified with compound assignment, so not final

    Integer count = 0;
    count--;
    // Valid: variable is decremented, so not final

    for (Integer i = 0; i < 10; i++) {
      // Valid: loop variable
    }

    final List<String> items = new List<String>();
    for (String item : items) {
      // Valid: foreach variable (item is excluded, items is declared as final)
    }
  }

  public void methodWithParameter(Integer param) {
    // Valid: parameter, not required to be final
    System.debug(param);
  }

  public void methodWithCatchBlock() {
    try {
      final Integer value = 5;
      // Valid: variable inside try block is declared as final
      throw new Exception('test');
    } catch (Exception e) {
      // Valid: catch block exception variable 'e' cannot be declared as final in Apex
      // (it is a Parameter node, not a VariableDeclaration, so it's excluded)
      String errorMsg = e.getMessage();
      // Valid: variable inside catch block that is reassigned
      errorMsg = errorMsg + ' additional info';
    }
  }

  public void methodWithReassignment() {
    Integer value = 5;
    if (true) {
      value = 10;
      // Valid: variable is reassigned, so not final
    }
  }

  public void methodWithNestedReassignment() {
    Integer outer = 1;
    if (true) {
      outer = 2;
      // Valid: variable is reassigned, so not final
    }
  }

  public void methodWithMultipleAssignments() {
    Integer x = 0;
    x = 1;
    x = 2;
    // Valid: variable is reassigned multiple times, so not final
  }
}

