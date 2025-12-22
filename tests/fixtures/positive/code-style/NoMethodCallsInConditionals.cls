public class Example {
  public void validMethod() {
    Integer value = getValue();
    if (value > 0) {
      // Valid: method result stored in variable
    }

    Boolean isValid = checkStatus();
    while (isValid) {
      // Valid: method result stored in variable
    }

    String name = getName();
    for (Integer i = 0; i < 10; i++) {
      // Valid: method result stored in variable
    }

    Integer count = getCount();
    String result = count > 0 ? 'positive' : 'negative';
    // Valid: method result stored in variable
  }

  private Integer getValue() {
    return 5;
  }

  private Boolean checkStatus() {
    return true;
  }

  private String getName() {
    return 'test';
  }

  private Integer getCount() {
    return 10;
  }
}

