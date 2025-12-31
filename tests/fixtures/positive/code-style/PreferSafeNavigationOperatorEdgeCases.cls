public class PreferSafeNavigationOperatorEdgeCases {
  // This test fixture demonstrates edge cases from Salesforce documentation
  // that cannot use safe navigation operator, even though they may not appear
  // in null-check patterns. These are documented for completeness.

  public void demonstrateEdgeCases() {
    // Edge Case 1: Namespace.Class expressions
    // Namespace.Class has multiple ReferenceExpressions, not instance access
    // Example: MyNamespace.MyClass.staticMethod()
    // Pattern: First ReferenceExpression is namespace/class name, not variable
    
    // Edge Case 2: Trigger.new
    // Trigger.new is a compile-time constant, not a variable
    // In trigger context: List<Account> accounts = Trigger.new;
    // Cannot use: Trigger?.new (invalid syntax)
    
    // Edge Case 3: Flow.interview.flowName
    // Flow.interview.flowName is a compile-time constant
    // Example: Flow.Interview flow = Flow.Interview.MyFlow;
    // Cannot use: Flow?.Interview?.MyFlow (invalid syntax)
    
    // Edge Case 4: Type.class
    Type accountType = Account.class;
    // Cannot use: Account?.class (invalid syntax)
    // Type.class is a compile-time constant
    
    // Edge Case 5: AClass.AStaticMethodCall()
    // Static method calls have ReferenceExpression[1] = class name, not variable
    String result = String.format('{0}', 'hello world');
    Integer value = Integer.valueOf('123');
    DateTime now = System.now();
    // Pattern: First ReferenceExpression is class name (String, Integer, System)
    
    // Edge Case 6: AClass.AStaticVariable
    // Static field access has ReferenceExpression[1] = class name, not variable
    Integer maxValue = Integer.MAX_VALUE;
    Integer minValue = Integer.MIN_VALUE;
    // Pattern: First ReferenceExpression is class name (Integer)
    
    // Edge Case 7: Page.pageName
    // Page.pageName is a compile-time constant
    // Example: PageReference ref = Page.MyPage;
    // Cannot use: Page?.MyPage (invalid syntax)
    // Pattern: Page has ReferenceExpression, not instance access
    
    // Edge Case 8: Assignment with safe navigation (foo?.bar = 42)
    Account acc = getAccount();
    if (acc != null) {
      acc.Name = 'New Name';
      // Cannot use: acc?.Name = 'New Name' (invalid - safe navigation in assignment)
    }
    
    // Edge Case 9: Increment operator (++foo?.bar)
    Integer count = 0;
    Account acc2 = getAccount();
    if (acc2 != null) {
      ++count;
      // Cannot use: ++acc2?.SomeField (invalid - safe navigation with increment)
      // Note: This shows increment pattern, though on local variable
    }
    
    // Edge Case 10: Decrement operator (--foo?.bar)
    Integer count2 = 10;
    Account acc3 = getAccount();
    if (acc3 != null) {
      --count2;
      // Cannot use: --acc3?.SomeField (invalid - safe navigation with decrement)
      // Note: This shows decrement pattern, though on local variable
    }
    
    // Edge Case 11: SOQL bind expressions
    Account queryAccount = getAccount();
    if (queryAccount != null) {
      List<Account> accounts = [SELECT Name FROM Account WHERE Id = :queryAccount.Id];
      // Cannot use: [SELECT Name FROM Account WHERE Id = :queryAccount?.Id];
      // Safe navigation operator is not allowed in SOQL bind expressions
    }
    
    // Edge Case 12: addError() on SObject scalar fields
    Contact contact = getContact();
    if (contact != null) {
      contact.LastName.addError('Required field');
      // Cannot use: contact?.LastName?.addError() (invalid - safe navigation with addError)
      // addError() calls on SObject fields cannot use safe navigation
    }
  }

  private Account getAccount() {
    return new Account();
  }

  private Contact getContact() {
    return new Contact();
  }
}

