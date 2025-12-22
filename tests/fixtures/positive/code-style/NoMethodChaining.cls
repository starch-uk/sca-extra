public class Example {
  public void validMethod() {
    List<String> items = getItems();
    Integer size = items.size();
    // Valid: using intermediary variable

    Account acc = getAccount();
    String name = acc.Name;
    // Valid: using intermediary variable

    final String result = getValue().toString();
    // Valid: method chaining in final variable declaration
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

