public class Example {
  private String name;
  private Integer value;
  private Boolean isValid;

  public String getName() {
    // Violation: trivial getter that only returns field
    return name;
  }

  public Integer getValue() {
    // Violation: trivial getter that only returns field
    return value;
  }

  public Boolean getIsValid() {
    // Violation: trivial getter that only returns field
    return isValid;
  }
}

