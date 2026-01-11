public class PreferNullCoalescingOverTernary {
  // Valid: Using null coalescing operator
  public void validNullCoalescing() {
    Account acc = getAccount();
    String data = getString();
    Integer num = getInteger();
    
    // Valid: Basic variable null coalescing
    String name = acc?.Name ?? 'Unknown';
    Integer value = acc?.Contacts?.size() ?? 0;
    
    // Valid: Simple variable null coalescing
    String result = data ?? 'default';
    Integer numValue = num ?? 0;
  }
  
  // Valid: Chained null coalescing operators
  public void validChainedNullCoalescing() {
    Account acc = getAccount();
    
    // Valid: Left-associative chaining
    String city = acc?.BillingCity ?? acc?.ShippingCity ?? 'N/A';
    String name = acc?.Name ?? acc?.AccountNumber ?? 'Unknown';
  }
  
  // Valid: Combining safe navigation with null coalescing
  public void validSafeNavigationWithNullCoalescing() {
    Account acc = getAccount();
    MyClass obj = getObject();
    List<String> items = getList();
    
    // Valid: Property access with safe navigation and null coalescing
    String name = acc?.Name ?? 'Unknown';
    String city = acc?.BillingCity ?? 'N/A';
    
    // Valid: Method call with safe navigation and null coalescing
    String value = obj?.getName() ?? 'default';
    Integer count = items?.size() ?? 0;
    
    // Valid: Chained property access
    Integer contactCount = acc?.Contacts?.size() ?? 0;
  }
  
  // Valid: SOQL query with null coalescing
  public void validSoqlWithNullCoalescing() {
    Account defaultAccount = new Account(Name = 'Default');
    Id accountId = getAccountId();
    
    // Valid: SOQL query result with null coalescing
    Account a = [SELECT Id, Name FROM Account WHERE Id = :accountId] ?? defaultAccount;
    
    // Valid: SOQL query with safe navigation and null coalescing
    String name = [SELECT Name FROM Account WHERE Id = :accountId]?.Name ?? 'Unknown';
  }
  
  // Valid: Different types with null coalescing
  public void validDifferentTypes() {
    String text = getString();
    Integer num = getInteger();
    Boolean flag = getBoolean();
    List<String> list1 = getList();
    Map<String, String> map1 = getMap();
    
    // Valid: String with null coalescing
    String result1 = text ?? '';
    
    // Valid: Integer with null coalescing
    Integer result2 = num ?? 0;
    
    // Valid: Boolean with null coalescing
    Boolean result3 = flag ?? false;
    
    // Valid: List with null coalescing
    List<String> result4 = list1 ?? new List<String>();
    
    // Valid: Map with null coalescing
    Map<String, String> result5 = map1 ?? new Map<String, String>();
  }
  
  // Valid: Ternary for non-null checks (not flagged by this rule)
  public void validTernaryForNonNullChecks() {
    String status = 'active';
    Integer count = 5;
    String name = 'test';
    
    // Valid: Ternary checking for specific value, not null
    String result1 = status == 'active' ? 'yes' : 'no';
    Integer value1 = count > 0 ? count : 1;
    Boolean flag = name.contains('test') ? true : false;
    
    // Valid: Ternary with different conditions
    String result2 = status != 'inactive' ? 'enabled' : 'disabled';
    Integer value2 = count < 10 ? count : 10;
  }
  
  // Valid: Complex expressions that shouldn't use null coalescing
  public void validComplexTernaries() {
    Integer a = 5;
    Integer b = 10;
    String str = 'hello';
    
    // Valid: Ternary with arithmetic operations
    Integer result = a > b ? a + 10 : b + 5;
    
    // Valid: Ternary with string operations
    String output = str.length() > 5 ? str.toUpperCase() : str.toLowerCase();
  }
  
  // Valid: Nested ternaries that aren't null checks
  public void validNestedTernaries() {
    Integer score = 85;
    
    // Valid: Nested ternary for grading (not a null check)
    String grade = score >= 90 ? 'A' : (score >= 80 ? 'B' : 'C');
  }
  
  // Helper methods
  private String getString() {
    return 'test';
  }
  
  private Integer getInteger() {
    return 42;
  }
  
  private Boolean getBoolean() {
    return true;
  }
  
  private Account getAccount() {
    return new Account();
  }
  
  private MyClass getObject() {
    return new MyClass();
  }
  
  private List<String> getList() {
    return new List<String>();
  }
  
  private Map<String, String> getMap() {
    return new Map<String, String>();
  }
  
  private Id getAccountId() {
    return '001000000000000AAA';
  }
  
  public class MyClass {
    public String getName() {
      return 'name';
    }
  }
}
