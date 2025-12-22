public class Example {
  public Integer add(Integer a, Integer b) {
    // Violation: method doesn't use instance state, should be static
    return a + b;
  }

  public String concatenate(String a, String b) {
    // Violation: method doesn't use instance state, should be static
    return a + b;
  }

  public Boolean isValid(Integer value) {
    // Violation: method doesn't use instance state, should be static
    return value > 0;
  }

  public void processData(List<String> items) {
    // Violation: method doesn't use instance state, should be static
    for (String item : items) {
      System.debug(item);
    }
  }
}

