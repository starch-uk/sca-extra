public class PreferNullCoalescingOverTernary {
  // Basic variable null checks
  public void basicVariableNullChecks() {
    String data = getString();
    Integer num = getInteger();
    
    // Violation: x != null ? x : defaultValue
    String result1 = data != null ? data : 'default';
    Integer value1 = num != null ? num : 0;
    
    // Violation: x == null ? defaultValue : x
    String result2 = data == null ? 'default' : data;
    Integer value2 = num == null ? 0 : num;
  }
  
  // Null on left side of comparison
  public void nullOnLeftSide() {
    String data = getString();
    Integer num = getInteger();
    Account acc = getAccount();
    
    // Violation: null == x ? defaultValue : x
    String result1 = null == data ? 'default' : data;
    Integer value1 = null == num ? 0 : num;
    
    // Violation: null != x ? x : defaultValue
    String result2 = null != data ? data : 'default';
    Account account1 = null != acc ? acc : new Account();
  }
  
  // Method calls with null checks
  public void methodCallNullChecks() {
    MyClass obj = getObject();
    List<String> items = getList();
    
    // Violation: obj != null ? obj.method() : defaultValue
    String value1 = obj != null ? obj.getName() : 'default';
    Integer count1 = items != null ? items.size() : 0;
    
    // Violation: obj == null ? defaultValue : obj.method()
    String value2 = obj == null ? 'default' : obj.getName();
    Integer count2 = items == null ? 0 : items.size();
  }
  
  // Property access with null checks
  public void propertyAccessNullChecks() {
    Account account = getAccount();
    Contact contact = getContact();
    
    // Violation: account != null ? account.Name : defaultValue
    String name1 = account != null ? account.Name : 'Unknown';
    String city1 = account != null ? account.BillingCity : 'N/A';
    
    // Violation: account == null ? defaultValue : account.Name
    String name2 = account == null ? 'Unknown' : account.Name;
    String email1 = contact == null ? 'no-email' : contact.Email;
  }
  
  // Chained property access with null checks
  public void chainedPropertyAccess() {
    Account account = getAccount();
    
    // Violation: account != null ? account.Contacts.size() : 0
    Integer contactCount = account != null ? account.Contacts.size() : 0;
    
    // Violation: account == null ? 0 : account.Contacts.size()
    Integer count = account == null ? 0 : account.Contacts.size();
  }
  
  // Complex expressions with null checks
  public void complexExpressions() {
    Account account = getAccount();
    String data = getString();
    
    // Violation: Complex property access
    String fullName = account != null ? account.Name + ' ' + account.BillingCity : 'Unknown';
    
    // Violation: Method call with parameters
    Boolean isValid = data != null ? data.length() > 0 : false;
  }
  
  // SOQL query with null check
  public void soqlQueryNullCheck() {
    Account defaultAccount = new Account(Name = 'Default');
    Id accountId = getAccountId();
    
    // Violation: SOQL query result null check
    Account a1 = [SELECT Id, Name FROM Account WHERE Id = :accountId] != null 
      ? [SELECT Id, Name FROM Account WHERE Id = :accountId] 
      : defaultAccount;
    
    // Violation: SOQL query with property access
    String name = [SELECT Name FROM Account WHERE Id = :accountId] != null
      ? [SELECT Name FROM Account WHERE Id = :accountId].Name
      : 'Unknown';
  }
  
  // Different types with null checks
  public void differentTypes() {
    String text = getString();
    Integer num = getInteger();
    Boolean flag = getBoolean();
    List<String> list1 = getList();
    Map<String, String> map1 = getMap();
    
    // Violation: String with null check
    String result1 = text != null ? text : '';
    
    // Violation: Integer with null check
    Integer result2 = num != null ? num : 0;
    
    // Violation: Boolean with null check
    Boolean result3 = flag != null ? flag : false;
    
    // Violation: List with null check
    List<String> result4 = list1 != null ? list1 : new List<String>();
    
    // Violation: Map with null check
    Map<String, String> result5 = map1 != null ? map1 : new Map<String, String>();
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
  
  private Contact getContact() {
    return new Contact();
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
