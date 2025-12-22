/**
 * Stress test for code-style rules
 * Contains 100+ violations across all code-style rules
 */

public class StressCodeStyle {
  public void stressNoMethodCallsInConditionals() {
    // 20 violations: NoMethodCallsInConditionals
    if (getValue() > 0) {}
    if (getValue() < 10) {}
    if (getValue() == 5) {}
    if (getValue() != 0) {}
    if (getValue() >= 1) {}
    if (getValue() <= 9) {}
    while (checkStatus()) {}
    while (isValid()) {}
    for (Integer i = 0; i < getCount(); i++) {}
    for (Integer i = 0; i < getLength(); i++) {}
    switch on getValue() {
      when 1 {}
      when 2 {}
    }
    String r1 = getName() != null ? getName() : 'default';
    String r2 = getValue() > 0 ? 'positive' : 'negative';
    String r3 = isValid() ? 'yes' : 'no';
    String r4 = getCount() > 10 ? 'many' : 'few';
    String r5 = getLength() > 5 ? 'long' : 'short';
    if (getValue() > 0 && getValue() < 10) {}
    if (getValue() == 5 || getValue() == 10) {}
    if (getValue() != 0 && isValid()) {}
  }

  public void stressNoMethodChaining() {
    // 20 violations: NoMethodChaining
    Integer s1 = getItems().size();
    Integer s2 = getList().size();
    String n1 = getAccount().Name;
    String n2 = getContact().Name;
    String r1 = getValue().toString();
    String r2 = getCount().toString();
    List<String> c1 = getItems().clone();
    List<String> c2 = getList().clone();
    String u1 = getValue().toString().toUpperCase();
    String u2 = getName().toLowerCase();
    Integer h1 = getAccount().Contacts.size();
    Integer h2 = getContact().Accounts.size();
    String f1 = getItems().get(0);
    String f2 = getList().get(0);
    Boolean e1 = getItems().isEmpty();
    Boolean e2 = getList().isEmpty();
    String j1 = String.join(getItems(), ',');
    String j2 = String.join(getList(), ',');
    Integer i1 = getItems().indexOf('test');
    Integer i2 = getList().indexOf('test');
  }

  public void stressPreferSafeNavigationOperator() {
    // 15 violations: PreferSafeNavigationOperator
    Account a1 = getAccount();
    if (a1 != null) {
      String c1 = a1.BillingCity;
    }
    Account a2 = getAccount();
    if (a2 != null) {
      String c2 = a2.ShippingCity;
    }
    Contact c1 = getContact();
    if (c1 != null) {
      String e1 = c1.Email;
    }
    Contact c2 = getContact();
    if (c2 != null) {
      String p1 = c2.Phone;
    }
    Opportunity o1 = getOpportunity();
    if (o1 != null) {
      Decimal a1 = o1.Amount;
    }
    Account a3 = getAccount();
    if (a3 != null) {
      Integer s1 = a3.Contacts.size();
    }
    Account a4 = getAccount();
    if (a4 != null) {
      List<Contact> cs = a4.Contacts;
    }
    Account a5 = getAccount();
    if (a5 != null) {
      String n1 = a5.Name;
    }
  }

  public void stressPreferNullCoalescingOverTernary() {
    // 15 violations: PreferNullCoalescingOverTernary
    Account a1 = getAccount();
    String c1 = a1 != null ? a1.BillingCity : 'Unknown';
    String c2 = a1 != null ? a1.ShippingCity : 'Unknown';
    Contact c3 = getContact();
    String e1 = c3 != null ? c3.Email : 'Unknown';
    String p1 = c3 != null ? c3.Phone : 'Unknown';
    Opportunity o1 = getOpportunity();
    Decimal a1 = o1 != null ? o1.Amount : 0;
    String n1 = getName();
    String r1 = n1 != null ? n1 : 'Default';
    Integer v1 = getValue();
    Integer r2 = v1 != null ? v1 : 0;
    Boolean b1 = getBoolean();
    Boolean r3 = b1 != null ? b1 : false;
    List<String> l1 = getList();
    List<String> r4 = l1 != null ? l1 : new List<String>();
    String s1 = getString();
    String r5 = s1 != null ? s1 : '';
    String s2 = getString();
    String r6 = s2 == null ? 'Default' : s2;
    Integer v2 = getValue();
    Integer r7 = v2 == null ? 0 : v2;
  }

  public void stressListInitializationMustBeMultiLine() {
    // 10 violations: ListInitializationMustBeMultiLine
    List<String> l1 = new List<String>{ 'a', 'b' };
    List<String> l2 = new List<String>{ 'x', 'y', 'z' };
    List<Integer> l3 = new List<Integer>{ 1, 2, 3 };
    List<Boolean> l4 = new List<Boolean>{ true, false };
    List<String> l5 = new List<String>{ 'one', 'two', 'three', 'four' };
    List<Integer> l6 = new List<Integer>{ 10, 20, 30, 40, 50 };
    List<String> l7 = new List<String>{ 'a', 'b', 'c', 'd', 'e', 'f' };
    List<Integer> l8 = new List<Integer>{ 1, 2, 3, 4, 5, 6, 7 };
    List<String> l9 = new List<String>{ 'item1', 'item2', 'item3' };
    List<Integer> l10 = new List<Integer>{ 100, 200, 300 };
  }

  public void stressMapInitializationMustBeMultiLine() {
    // 10 violations: MapInitializationMustBeMultiLine
    Map<String, String> m1 = new Map<String, String>{ 'a' => '1', 'b' => '2' };
    Map<String, Integer> m2 = new Map<String, Integer>{ 'x' => 1, 'y' => 2 };
    Map<Integer, String> m3 = new Map<Integer, String>{ 1 => 'a', 2 => 'b' };
    Map<String, Boolean> m4 = new Map<String, Boolean>{ 't' => true, 'f' => false };
    Map<String, String> m5 = new Map<String, String>{ 'k1' => 'v1', 'k2' => 'v2', 'k3' => 'v3' };
    Map<Integer, Integer> m6 = new Map<Integer, Integer>{ 1 => 10, 2 => 20, 3 => 30 };
    Map<String, String> m7 = new Map<String, String>{ 'a' => '1', 'b' => '2', 'c' => '3', 'd' => '4' };
    Map<String, Integer> m8 = new Map<String, Integer>{ 'x' => 1, 'y' => 2, 'z' => 3 };
    Map<Integer, String> m9 = new Map<Integer, String>{ 1 => 'a', 2 => 'b', 3 => 'c', 4 => 'd', 5 => 'e' };
    Map<String, Boolean> m10 = new Map<String, Boolean>{ 't1' => true, 't2' => false, 't3' => true };
  }

  public void stressMapShouldBeInitializedWithValues() {
    // 10 violations: MapShouldBeInitializedWithValues
    Map<String, String> m1 = new Map<String, String>();
    m1.put('key1', 'value1');
    Map<String, Integer> m2 = new Map<String, Integer>();
    m2.put('key2', 2);
    Map<Integer, String> m3 = new Map<Integer, String>();
    m3.put(3, 'value3');
    Map<String, Boolean> m4 = new Map<String, Boolean>();
    m4.put('key4', true);
    Map<String, String> m5 = new Map<String, String>();
    m5.put('key5', 'value5');
    Map<String, Integer> m6 = new Map<String, Integer>();
    m6.put('key6', 6);
    Map<Integer, String> m7 = new Map<Integer, String>();
    m7.put(7, 'value7');
    Map<String, Boolean> m8 = new Map<String, Boolean>();
    m8.put('key8', false);
    Map<String, String> m9 = new Map<String, String>();
    m9.put('key9', 'value9');
    Map<String, Integer> m10 = new Map<String, Integer>();
    m10.put('key10', 10);
  }

  public void stressPreferStringJoinOverMultipleNewlines() {
    // 10 violations: PreferStringJoinOverMultipleNewlines
    String s1 = 'Line 1\n\n\nLine 2';
    String s2 = 'Text\n\n\nMore';
    String s3 = 'Start\n\n\nEnd';
    String s4 = 'A\n\n\nB\n\n\nC';
    String s5 = 'One\n\n\nTwo\n\n\nThree';
    String s6 = 'First\n\n\nSecond\n\n\nThird\n\n\nFourth';
    String s7 = 'Item1\n\n\nItem2\n\n\nItem3';
    String s8 = 'Part1\n\n\nPart2\n\n\nPart3\n\n\nPart4';
    String s9 = 'Section1\n\n\nSection2';
    String s10 = 'Block1\n\n\nBlock2\n\n\nBlock3';
  }

  public void stressPreferConcatenationOverStringJoinWithEmpty() {
    // 10 violations: PreferConcatenationOverStringJoinWithEmpty
    String j1 = String.join(new List<String>{ 'a', 'b' }, '');
    String j2 = String.join(new List<String>{ 'x', 'y', 'z' }, '');
    String j3 = String.join(new List<String>{ '1', '2', '3' }, '');
    String j4 = String.join(new List<String>{ 'one', 'two' }, '');
    String j5 = String.join(new List<String>{ 'test', 'value' }, '');
    String j6 = String.join(new List<String>{ 'a', 'b', 'c', 'd' }, '');
    String j7 = String.join(new List<String>{ 'x', 'y' }, '');
    String j8 = String.join(new List<String>{ '1', '2', '3', '4', '5' }, '');
    String j9 = String.join(new List<String>{ 'item1', 'item2' }, '');
    String j10 = String.join(new List<String>{ 'part1', 'part2', 'part3' }, '');
  }

  public void stressPreferStringJoinOverConcatenation() {
    // 10 violations: PreferStringJoinOverConcatenation
    String c1 = 'a' + ',' + 'b';
    String c2 = 'x' + ',' + 'y' + ',' + 'z';
    String c3 = '1' + ',' + '2' + ',' + '3';
    String c4 = 'one' + ',' + 'two';
    String c5 = 'test' + ',' + 'value';
    String c6 = 'a' + ',' + 'b' + ',' + 'c' + ',' + 'd';
    String c7 = 'x' + ',' + 'y';
    String c8 = '1' + ',' + '2' + ',' + '3' + ',' + '4' + ',' + '5';
    String c9 = 'item1' + ',' + 'item2';
    String c10 = 'part1' + ',' + 'part2' + ',' + 'part3';
  }

  public void stressMultipleStringContainsCalls() {
    // 10 violations: MultipleStringContainsCalls
    String text = 'test string';
    if (text.contains('a') && text.contains('b')) {}
    if (text.contains('x') && text.contains('y') && text.contains('z')) {}
    if (text.contains('1') && text.contains('2')) {}
    if (text.contains('test') && text.contains('value')) {}
    if (text.contains('one') && text.contains('two') && text.contains('three')) {}
    if (text.contains('a') && text.contains('b') && text.contains('c') && text.contains('d')) {}
    if (text.contains('x') && text.contains('y')) {}
    if (text.contains('1') && text.contains('2') && text.contains('3') && text.contains('4') && text.contains('5')) {}
    if (text.contains('item') && text.contains('value')) {}
    if (text.contains('part1') && text.contains('part2') && text.contains('part3')) {}
  }

  public void stressPreferMethodCallsInLoopConditions() {
    // 10 violations: PreferMethodCallsInLoopConditions
    while (true) {
      if (shouldBreak1()) break;
    }
    while (true) {
      if (shouldBreak2()) break;
    }
    while (true) {
      if (shouldBreak3()) break;
    }
    while (true) {
      if (shouldBreak4()) break;
    }
    while (true) {
      if (shouldBreak5()) break;
    }
    while (true) {
      if (shouldBreak6()) break;
    }
    while (true) {
      if (shouldBreak7()) break;
    }
    while (true) {
      if (shouldBreak8()) break;
    }
    while (true) {
      if (shouldBreak9()) break;
    }
    while (true) {
      if (shouldBreak10()) break;
    }
  }

  public void stressPreferBuilderPatternChaining() {
    // 10 violations: PreferBuilderPatternChaining
    Builder b1 = new Builder();
    b1 = b1.setName('test1');
    Builder b2 = new Builder();
    b2 = b2.setValue(1);
    Builder b3 = new Builder();
    b3 = b3.setFlag(true);
    Builder b4 = new Builder();
    b4 = b4.setName('test4');
    b4 = b4.setValue(4);
    Builder b5 = new Builder();
    b5 = b5.setValue(5);
    b5 = b5.setFlag(false);
    Builder b6 = new Builder();
    b6 = b6.setName('test6');
    Builder b7 = new Builder();
    b7 = b7.setValue(7);
    Builder b8 = new Builder();
    b8 = b8.setFlag(true);
    Builder b9 = new Builder();
    b9 = b9.setName('test9');
    b9 = b9.setValue(9);
    b9 = b9.setFlag(true);
    Builder b10 = new Builder();
    b10 = b10.setValue(10);
    b10 = b10.setName('test10');
  }

  public void stressPreferStringJoinWithSeparatorOverEmpty() {
    // 10 violations: PreferStringJoinWithSeparatorOverEmpty
    String j1 = String.join(new List<String>{ 'test1', 'test2' }, '');
    String j2 = String.join(new List<String>{ 'value1', 'value2' }, '');
    String j3 = String.join(new List<String>{ 'item1', 'item2' }, '');
    String j4 = String.join(new List<String>{ 'part1', 'part2' }, '');
    String j5 = String.join(new List<String>{ 'a1', 'a2' }, '');
    String j6 = String.join(new List<String>{ 'x1', 'x2' }, '');
    String j7 = String.join(new List<String>{ 'one1', 'one2' }, '');
    String j8 = String.join(new List<String>{ 'test1', 'test2', 'test3' }, '');
    String j9 = String.join(new List<String>{ 'value1', 'value2', 'value3' }, '');
    String j10 = String.join(new List<String>{ 'item1', 'item2', 'item3' }, '');
  }

  public void stressSingleArgumentMustBeSingleLine() {
    // 10 violations: SingleArgumentMustBeSingleLine
    processValue(
      getValue()
    );
    processName(
      getName()
    );
    processCount(
      getCount()
    );
    processLength(
      getLength()
    );
    processString(
      getString()
    );
    processBoolean(
      getBoolean()
    );
    processList(
      getList()
    );
    processAccount(
      getAccount()
    );
    processContact(
      getContact()
    );
    processOpportunity(
      getOpportunity()
    );
  }

  public void stressNoMethodCallsAsArguments() {
    // 10 violations: NoMethodCallsAsArguments
    processValue(getValue());
    processName(getName());
    processCount(getCount());
    processLength(getLength());
    processString(getString());
    processBoolean(getBoolean());
    processList(getList());
    processAccount(getAccount());
    processContact(getContact());
    processOpportunity(getOpportunity());
  }

  public void stressNoConsecutiveBlankLines() {
    // Multiple violations: NoConsecutiveBlankLines
    public void method1() {}


    public void method2() {}


    public void method3() {}


    public void method4() {}
  }

  public void stressAvoidOneLinerMethods() {
    // 10 violations: AvoidOneLinerMethods
    public Integer getOne() { return 1; }
    public Integer getTwo() { return 2; }
    public Integer getThree() { return 3; }
    public String getName() { return 'name'; }
    public String getValue() { return 'value'; }
    public Boolean isValid() { return true; }
    public Boolean isActive() { return false; }
    public void setOne(Integer v) { value = v; }
    public void setTwo(Integer v) { value = v; }
    public void setThree(Integer v) { value = v; }
  }

  // Helper methods
  private Integer getValue() { return 0; }
  private Boolean checkStatus() { return true; }
  private Boolean isValid() { return true; }
  private Integer getCount() { return 0; }
  private Integer getLength() { return 0; }
  private String getName() { return ''; }
  private String getString() { return ''; }
  private Boolean getBoolean() { return false; }
  private List<String> getItems() { return new List<String>(); }
  private List<String> getList() { return new List<String>(); }
  private Account getAccount() { return new Account(); }
  private Contact getContact() { return new Contact(); }
  private Opportunity getOpportunity() { return new Opportunity(); }
  private Boolean shouldBreak1() { return false; }
  private Boolean shouldBreak2() { return false; }
  private Boolean shouldBreak3() { return false; }
  private Boolean shouldBreak4() { return false; }
  private Boolean shouldBreak5() { return false; }
  private Boolean shouldBreak6() { return false; }
  private Boolean shouldBreak7() { return false; }
  private Boolean shouldBreak8() { return false; }
  private Boolean shouldBreak9() { return false; }
  private Boolean shouldBreak10() { return false; }
  private void processValue(Integer v) {}
  private void processName(String n) {}
  private void processCount(Integer c) {}
  private void processLength(Integer l) {}
  private void processString(String s) {}
  private void processBoolean(Boolean b) {}
  private void processList(List<String> l) {}
  private void processAccount(Account a) {}
  private void processContact(Contact c) {}
  private void processOpportunity(Opportunity o) {}
}

