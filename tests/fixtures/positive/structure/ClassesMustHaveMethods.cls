public class ValidClass {
  public String name;

  public ValidClass() {
    this.name = 'test';
  }

  public void instanceMethod() {
    // Valid: class has instance method
  }

  public String getName() {
    return this.name;
  }
}

public class ValidClassWithStatic {
  public String name;

  public ValidClassWithStatic() {
    this.name = 'test';
  }

  public static void staticMethod() {
    // Valid: has instance method below
  }

  public void instanceMethod() {
    // Valid: class has instance method
  }
}

public class ValidInnerClass {
  public class Inner {
    public String value;

    public Inner() {
      this.value = 'test';
    }

    public void instanceMethod() {
      // Valid: inner class has instance method
    }
  }
}

