/**
 * Stress test for documentation rules
 * Contains 30+ violations across all documentation rules
 */

public class StressDocumentation {
  // 20 violations: ExceptionDocumentationRequired
  public void methodThrowsException1() {
    throw new CustomException('Error 1');
  }

  public void methodThrowsException2() {
    throw new CustomException('Error 2');
  }

  public void methodThrowsException3() {
    throw new CustomException('Error 3');
  }

  public void methodThrowsException4() {
    throw new CustomException('Error 4');
  }

  public void methodThrowsException5() {
    throw new CustomException('Error 5');
  }

  public void methodThrowsException6() {
    throw new IllegalArgumentException('Invalid argument');
  }

  public void methodThrowsException7() {
    throw new IllegalArgumentException('Invalid argument');
  }

  public void methodThrowsException8() {
    throw new IllegalArgumentException('Invalid argument');
  }

  public void methodThrowsException9() {
    throw new NullPointerException('Null value');
  }

  public void methodThrowsException10() {
    throw new NullPointerException('Null value');
  }

  public void methodThrowsException11() {
    throw new NullPointerException('Null value');
  }

  public void methodThrowsException12() {
    throw new DmlException('DML error');
  }

  public void methodThrowsException13() {
    throw new DmlException('DML error');
  }

  public void methodThrowsException14() {
    throw new DmlException('DML error');
  }

  public void methodThrowsException15() {
    throw new QueryException('Query error');
  }

  public void methodThrowsException16() {
    throw new QueryException('Query error');
  }

  public void methodThrowsException17() {
    throw new QueryException('Query error');
  }

  public void methodThrowsException18() {
    throw new SecurityException('Security error');
  }

  public void methodThrowsException19() {
    throw new SecurityException('Security error');
  }

  public void methodThrowsException20() {
    throw new SecurityException('Security error');
  }

  // 10 violations: SingleLineDocumentationFormat
  /** This is a single line comment that should be formatted properly */
  public void methodWithBadDoc1() {}

  /** Another single line comment */
  public void methodWithBadDoc2() {}

  /** Single line documentation */
  public void methodWithBadDoc3() {}

  /** Test method documentation */
  public void methodWithBadDoc4() {}

  /** Description of method */
  public void methodWithBadDoc5() {}

  /** Method comment */
  public void methodWithBadDoc6() {}

  /** Another comment */
  public void methodWithBadDoc7() {}

  /** Documentation */
  public void methodWithBadDoc8() {}

  /** Comment */
  public void methodWithBadDoc9() {}

  /** Description */
  public void methodWithBadDoc10() {}
}

