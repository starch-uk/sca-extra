public class Example {
  private String instanceField;

  public void instanceMethod() {
    // Valid: uses instance field
    this.instanceField = 'test';
  }

  public void methodUsingThis() {
    // Valid: uses 'this'
    String value = this.instanceField;
  }

  public void methodUsingInstanceField() {
    // Valid: uses instance field directly
    String value = instanceField;
  }

  public static void staticMethod() {
    // Valid: already static
    Integer value = 5;
  }

  public abstract void abstractMethod();
  // Valid: abstract method

  public Example() {
    // Valid: constructor
  }
}

public abstract class AbstractClass {
  public void method() {
    // Valid: abstract class method
  }
}

