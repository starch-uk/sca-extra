public class Example {
  private String name;

  public String getName() {
    // Valid: getter with logic
    if (name == null) {
      return 'Default';
    }
    return name;
  }

  public String getFullName() {
    // Valid: getter with method call
    return name.toUpperCase();
  }

  public String getComputedValue() {
    // Valid: getter with computation
    return name + ' - ' + System.now().format();
  }

  public String getNameWithValidation() {
    // Valid: getter with conditional logic
    if (String.isBlank(name)) {
      return 'Unknown';
    }
    return name.trim();
  }

  // Valid: auto-property
  public String autoProperty { get; set; }

  // Valid: final field
  public final String finalField = 'constant';
}

