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

    for (Integer i = 0; i < 10; i++) {
      // Valid: loop variable
    }

    for (String item : items) {
      // Valid: foreach variable
    }
  }

  public void methodWithParameter(Integer param) {
    // Valid: parameter, not required to be final
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
}

