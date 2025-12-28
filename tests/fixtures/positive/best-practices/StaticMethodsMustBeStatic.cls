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

public class PropertyExamples {
  /** Base indentation level. */
  public Integer baseIndent { get; private set; }

  /**
   * Check if the base indent is set.
   * @return true if base indent is set
   */
  public Boolean hasBaseIndent() {
    // Valid: uses property field
    if (baseIndent == null) {
      return false;
    }
    return true;
  }

  public Integer getBaseIndentValue() {
    // Valid: uses property field directly
    return baseIndent;
  }

  public void setBaseIndentValue(Integer value) {
    // Valid: uses property field in assignment
    baseIndent = value;
  }

  // Property with getter only
  public String name { get; }

  public String getName() {
    // Valid: uses property field
    return name;
  }

  // Property with setter only
  private String description { private get; set; }

  public void setDescription(String desc) {
    // Valid: uses property field
    description = desc;
  }

  // Multiple properties
  public Integer count { get; set; }
  public Boolean enabled { get; set; }

  public Boolean isConfigured() {
    // Valid: uses multiple property fields
    return count != null && enabled != null;
  }

  public void configure(Integer cnt, Boolean en) {
    // Valid: uses multiple property fields
    count = cnt;
    enabled = en;
  }

  // Property with this keyword
  public String title { get; set; }

  public String getTitle() {
    // Valid: uses property field with this
    return this.title;
  }

  // Property in conditional
  public Integer threshold { get; set; }

  public Boolean isAboveThreshold(Integer value) {
    // Valid: uses property field in condition
    return value > threshold;
  }

  // Property in method call
  public String prefix { get; set; }

  public String buildMessage(String suffix) {
    // Valid: uses property field in expression
    return prefix + suffix;
  }

  // Property in return statement
  public Integer maxValue { get; set; }

  public Integer getMaxValue() {
    // Valid: uses property field in return
    return maxValue;
  }

  // Property with different types
  public String textValue { get; set; }
  public Integer numericValue { get; set; }
  public Boolean booleanValue { get; set; }
  public List<String> listValue { get; set; }
  public Map<String, String> mapValue { get; set; }

  public Boolean hasAllValues() {
    // Valid: uses multiple property fields of different types
    return textValue != null 
      && numericValue != null 
      && booleanValue != null
      && listValue != null
      && mapValue != null;
  }

  // Property in complex expression
  public Integer multiplier { get; set; }

  public Integer calculate(Integer base) {
    // Valid: uses property field in calculation
    return base * multiplier;
  }

  // Property accessed in loop
  public List<String> items { get; set; }

  public void processItems() {
    // Valid: uses property field in loop
    for (String item : items) {
      System.debug(item);
    }
  }

  // Property in nested method call
  public String context { get; set; }

  public void logContext() {
    // Valid: uses property field as method argument
    System.debug('Context: ' + context);
  }

  // Property with getter/setter access
  public Integer value { get; private set; }

  public Integer getValue() {
    // Valid: uses property field
    return value;
  }

  private void setValueInternal(Integer val) {
    // Valid: uses property field in setter
    value = val;
  }

  // Property in ternary expression
  public Integer limit { get; set; }

  public Integer getLimitOrDefault(Integer defaultLimit) {
    // Valid: uses property field in ternary
    return limit != null ? limit : defaultLimit;
  }

  // Property in switch statement
  public String status { get; set; }

  public Integer getStatusCode() {
    // Valid: uses property field in switch
    switch on status {
      when 'active' {
        return 200;
      }
      when 'inactive' {
        return 404;
      }
      when else {
        return 500;
      }
    }
  }

  // Property with inheritance scenario
  public String baseProperty { get; set; }

  public Boolean hasBaseProperty() {
    // Valid: uses property field
    return baseProperty != null;
  }

  // Property in try-catch
  public String errorMessage { get; set; }

  public void handleError() {
    // Valid: uses property field in try-catch
    try {
      if (errorMessage != null) {
        System.debug(errorMessage);
      }
    } catch (Exception e) {
      errorMessage = e.getMessage();
    }
  }

  // Property with method chaining
  public String data { get; set; }

  public String processData() {
    // Valid: uses property field in method chain
    return data?.toUpperCase();
  }

  // Property in assignment expression
  public Integer counter { get; set; }

  public void increment() {
    // Valid: uses property field in assignment
    counter = counter + 1;
  }

  // Property with null coalescing
  public String defaultText { get; set; }

  public String getTextOrDefault(String fallback) {
    // Valid: uses property field with null coalescing
    return defaultText ?? fallback;
  }
}

public class OtherInstanceStatePatterns {
  // Instance field access patterns
  private String field1;
  protected Integer field2;
  public Boolean field3;

  public void useField1() {
    // Valid: uses private instance field
    String value = field1;
  }

  public void useField2() {
    // Valid: uses protected instance field
    Integer num = field2;
  }

  public void useField3() {
    // Valid: uses public instance field
    Boolean flag = field3;
  }

  public void useMultipleFields() {
    // Valid: uses multiple instance fields
    String result = field1 + String.valueOf(field2) + String.valueOf(field3);
  }

  // Instance field with this keyword
  private String name;

  public void useThisField() {
    // Valid: uses instance field with this
    this.name = 'test';
  }

  public String getNameWithThis() {
    // Valid: uses instance field with this
    return this.name;
  }

  // Instance field in method call
  private Integer count;

  public void incrementCount() {
    // Valid: uses instance field in method call
    setCount(count + 1);
  }

  private void setCount(Integer value) {
    count = value;
  }

  // Instance field in conditional
  private Boolean enabled;

  public Boolean isEnabled() {
    // Valid: uses instance field in condition
    return enabled == true;
  }

  // Instance field in loop
  private List<String> items;

  public void processItems() {
    // Valid: uses instance field in loop
    for (String item : items) {
      System.debug(item);
    }
  }

  // Instance field in return
  private String message;

  public String getMessage() {
    // Valid: uses instance field in return
    return message;
  }

  // Instance field in assignment
  private Integer value;

  public void setValue(Integer val) {
    // Valid: uses instance field in assignment
    value = val;
  }

  // Instance field in complex expression
  private Integer multiplier;

  public Integer calculate(Integer base) {
    // Valid: uses instance field in calculation
    return base * multiplier;
  }

  // Instance field with null check
  private String data;

  public Boolean hasData() {
    // Valid: uses instance field in null check
    return data != null;
  }

  // Instance field in ternary
  private Integer limit;

  public Integer getLimitOrDefault(Integer defaultLimit) {
    // Valid: uses instance field in ternary
    return limit != null ? limit : defaultLimit;
  }

  // Instance field in switch
  private String status;

  public Integer getStatusCode() {
    // Valid: uses instance field in switch
    switch on status {
      when 'active' {
        return 200;
      }
      when else {
        return 500;
      }
    }
  }

  // Instance field in try-catch
  private String errorMessage;

  public void handleError() {
    // Valid: uses instance field in try-catch
    try {
      if (errorMessage != null) {
        System.debug(errorMessage);
      }
    } catch (Exception e) {
      errorMessage = e.getMessage();
    }
  }

  // Instance field with method chaining
  private String text;

  public String processText() {
    // Valid: uses instance field in method chain
    return text?.toUpperCase();
  }

  // Instance field in assignment expression
  private Integer counter;

  public void increment() {
    // Valid: uses instance field in assignment
    counter = counter + 1;
  }

  // Instance field with null coalescing
  private String defaultText;

  public String getTextOrDefault(String fallback) {
    // Valid: uses instance field with null coalescing
    return defaultText ?? fallback;
  }

  // Mixed property and field access
  public String propertyValue { get; set; }
  private String fieldValue;

  public Boolean hasValues() {
    // Valid: uses both property and field
    return propertyValue != null && fieldValue != null;
  }
}

