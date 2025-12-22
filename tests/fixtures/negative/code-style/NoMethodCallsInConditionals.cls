public class Example {
  public void invalidMethod() {
    if (getValue() > 0) {
      // Violation: method call in if condition
    }

    while (checkStatus()) {
      // Violation: method call in while condition
    }

    for (Integer i = 0; i < getCount(); i++) {
      // Violation: method call in for condition
    }

    String result = getName() != null ? getName() : 'default';
    // Violation: method call in ternary condition

    switch on getValue() {
      when 1 {
        // Violation: method call in switch
      }
    }
  }

  private Integer getValue() {
    return 5;
  }

  private Boolean checkStatus() {
    return true;
  }

  private Integer getCount() {
    return 10;
  }

  private String getName() {
    return 'test';
  }
}

