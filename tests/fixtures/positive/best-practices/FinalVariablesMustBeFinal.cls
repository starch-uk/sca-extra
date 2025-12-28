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
}

