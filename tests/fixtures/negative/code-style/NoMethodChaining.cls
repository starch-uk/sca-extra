public class Example {
  public void invalidMethod() {
    Integer size = getItems().size();
    // Violation: method chaining

    String name = getAccount().Name;
    // Violation: method chaining

    String result = getValue().toString().toUpperCase();
    // Violation: method chaining

    List<String> items = getItems().clone();
    // Violation: method chaining
  }

  private List<String> getItems() {
    return new List<String>();
  }

  private Account getAccount() {
    return new Account();
  }

  private Integer getValue() {
    return 5;
  }
}

