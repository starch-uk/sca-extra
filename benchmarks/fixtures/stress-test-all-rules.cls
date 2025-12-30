/**
 * Comprehensive stress test fixture for all PMD rules
 * This file contains complex, realistic Apex code designed to trigger
 * multiple violations across all rule categories to benchmark performance
 */

public class StressTestAllRules {
  // Violations: StaticVariablesMustBeFinalAndScreamingSnakeCase

  private static Integer counter = 0;
  private static String config = 'test';
  // Violations: StaticVariablesMustBeFinalAndScreamingSnakeCase

  public class Inner {
    public static Integer value = 5;
    public static void method() {}
    // Violations: InnerClassesCannotHaveStaticMembers

    public static class Nested {
      // Violations: InnerClassesCannotBeStatic
    }
  }

  public class Inner_With_Underscores {
    // Violations: InnerClassesMustBeOneWord
  }

  public class ParameterClass {
    public String name;
    public Integer value;

    public ParameterClass() {}
    public ParameterClass(String n) { name = n; }
    // Violations: NoParameterClasses, ClassesMustHaveMethods
  }

  private String name;
  private Integer value;
  private Boolean isValid;

  public String getName() {
    return name;
    // Violations: AvoidTrivialPropertyGetters
  }

  public Integer getValue() {
    return value;
    // Violations: AvoidTrivialPropertyGetters
  }

  public void processData(Integer x, String s, Boolean b) {
    // Violations: NoSingleLetterVariableNames, NoAbbreviations (parameters: x, s, b)

    Integer ctx = 0;
    Integer idx = 5;
    String msg = 'test';
    String cfg = 'config';
    Integer val = 10;
    Account acc = new Account();
    Contact con = new Contact();
    Opportunity opp = new Opportunity();
    // Violations: NoAbbreviations (variables)

  public void processAccount(Account acc) {}
  public void configure(String cfg) {}
  public void setContext(String ctx) {}
  public void setIndex(Integer idx) {}
  public void sendMessage(String msg) {}
  // Violations: NoAbbreviations (parameters)

  private Account acc;
  private String cfg;
  private String ctx;
  private Integer idx;
  private String msg;
  // Violations: NoAbbreviations (fields)

    if (getValue() > 0) {
      // Violations: NoMethodCallsInConditionals
    }

    while (checkStatus()) {
      // Violations: NoMethodCallsInConditionals
    }

    for (Integer i = 0; i < getCount(); i++) {
      // Violations: NoMethodCallsInConditionals
    }

    String result = getName() != null ? getName() : 'default';
    // Violations: NoMethodCallsInConditionals, PreferNullCoalescingOverTernary

    Account account = getAccount();
    if (account != null) {
      String city = account.BillingCity;
      // Violations: PreferSafeNavigationOperator
    }

    String city = account != null ? account.BillingCity : 'Unknown';
    // Violations: PreferNullCoalescingOverTernary

    Map<String, String> map2 = new Map<String, String>();
    map2.put('key', 'value');
    // Violations: MapShouldBeInitializedWithValues

    String text = 'Line 1\n\n\nLine 2';
    // Violations: PreferStringJoinOverMultipleNewlines

    String joined = String.join(new List<String>{ 'a', 'b' }, '');
    // Violations: PreferConcatenationOverStringJoinWithEmpty

    String result2 = 'prefix' + 'suffix' + 'more';
    // Violations: PreferStringJoinOverConcatenation

    if (text.contains('a') && text.contains('b') && text.contains('c')) {
      // Violations: MultipleStringContainsCalls
    }

    while (true) {
      if (shouldBreak()) {
        break;
      }
      // Violations: PreferMethodCallsInLoopConditions
    }

    Builder builder = new Builder();
    builder = builder.setName('test');
    builder = builder.setValue(5);
    // Violations: PreferBuilderPatternChaining

    String common = String.join(new List<String>{ 'test1', 'test2' }, '');
    // Violations: PreferStringJoinWithSeparatorOverEmpty

    processValue(
      getValue()
    );
    // Violations: SingleArgumentMustBeSingleLine, NoMethodCallsAsArguments

    if (x > 0) {
      if (y > 0) {
        // Violations: CombineNestedIfStatements
      }
    }

    if (value == 1) {
      // do something
    } else if (value == 2) {
      // do something
    } else if (value == 3) {
      // do something
    } else if (value == 4) {
      // Violations: PreferSwitchOverIfElseChains
    }

    this.name = 'test';
    this.value = 5;
    // Violations: NoThisOutsideConstructors

    Integer count = getCount();
    return count;
    // Violations: NoUnnecessaryReturnVariables

    Account account2 = getAccount();
    String name2 = account2.Name;
    // Violations: NoUnnecessaryAttributeVariables

    String pattern = '\\d+';
    if (Pattern.matches(pattern, '123')) {
      // Violations: RegexPatternsMustBeStaticFinal
    }

    public void method() {
      Integer result = 5;
      // Violations: FinalVariablesMustBeFinal
    }

    public Integer add(Integer a, Integer b) {
      return a + b;
      // Violations: StaticMethodsMustBeStatic
    }

    public String concatenate(String a, String b) {
      return a + b;
      // Violations: StaticMethodsMustBeStatic
    }
  }

  public StressTestAllRules() {
    this.name = 'test';
    // Valid: this in constructor
  }

  public enum Status {
    ACTIVE,
    INACTIVE
    // Violations: EnumMinimumValues
  }

  private Integer getValue() { return 0; }
  private Boolean checkStatus() { return true; }
  private Integer getCount() { return 10; }
  private List<String> getItems() { return new List<String>(); }
  private Account getAccount() { return new Account(); }
  private Boolean shouldBreak() { return false; }
  private void processValue(Integer v) {}
}

