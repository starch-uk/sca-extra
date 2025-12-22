public class InvalidClass {
  public String name;
  public Integer value;

  public InvalidClass() {
    this.name = 'test';
  }

  public InvalidClass(String name) {
    this.name = name;
  }
  // Violation: class only has fields and constructors, no instance methods
}

public class InvalidInnerClass {
  public class Inner {
    public String value;

    public Inner() {
      this.value = 'test';
    }
    // Violation: inner class only has fields and constructors, no instance methods
  }
}

