/**
 * Stress test for method-signature rules
 * Contains 30+ violations across all method-signature rules
 */

public class StressMethodSignatures {
  // 15 violations: NoCustomParameterObjects
  public class ParameterObject1 {
    public String name;
    public Integer value;
  }

  public class ParameterObject2 {
    public String field1;
    public Integer field2;
  }

  public class ParameterObject3 {
    public String name;
    public Boolean isValid;
  }

  public class ParameterObject4 {
    public Integer count;
    public String status;
  }

  public class ParameterObject5 {
    public String type;
    public Integer size;
  }

  public class ParameterObject6 {
    public String category;
    public Boolean active;
  }

  public class ParameterObject7 {
    public String description;
    public Integer priority;
  }

  public class ParameterObject8 {
    public String title;
    public String content;
  }

  public class ParameterObject9 {
    public Integer x;
    public Integer y;
  }

  public class ParameterObject10 {
    public String start;
    public String end;
  }

  public class ParameterObject11 {
    public String source;
    public String destination;
  }

  public class ParameterObject12 {
    public Integer min;
    public Integer max;
  }

  public class ParameterObject13 {
    public String first;
    public String last;
  }

  public class ParameterObject14 {
    public String left;
    public String right;
  }

  public class ParameterObject15 {
    public String top;
    public String bottom;
  }

  // 15 violations: SingleParameterMustBeSingleLine
  public void method1(
    String param
  ) {}

  public void method2(
    Integer param
  ) {}

  public void method3(
    Boolean param
  ) {}

  public void method4(
    Decimal param
  ) {}

  public void method5(
    Date param
  ) {}

  public void method6(
    DateTime param
  ) {}

  public void method7(
    String param
  ) {}

  public void method8(
    Integer param
  ) {}

  public void method9(
    Boolean param
  ) {}

  public void method10(
    Decimal param
  ) {}

  public void method11(
    Date param
  ) {}

  public void method12(
    DateTime param
  ) {}

  public void method13(
    String param
  ) {}

  public void method14(
    Integer param
  ) {}

  public void method15(
    Boolean param
  ) {}
}

