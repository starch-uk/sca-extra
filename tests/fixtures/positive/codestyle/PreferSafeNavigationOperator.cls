public class Example {
  public void validMethod() {
    Account acc = getAccount();

    String name = acc?.Name;
    // Valid: using safe navigation operator

    Integer value = acc?.Contacts?.size();
    // Valid: chained safe navigation

    if (acc?.Name != null) {
      // Valid: safe navigation in condition
    }

    String result = acc?.BillingCity ?? 'Unknown';
    // Valid: safe navigation with null coalescing

    // Valid: Complex null checks with logic (not flagged)
    Account obj = getAccount();
    if (obj != null && obj.isValid()) {
      obj.process();
    }

    // Valid: Assignment to property (not flagged - safe navigation cannot be used)
    Account account = getAccount();
    if (account != null) {
      account.Name = 'New Name';
    }

    // Valid: Multiple statements (not flagged)
    Account obj2 = getAccount();
    if (obj2 != null) {
      obj2.process();
      obj2.finalize();
    }

    // Valid: addError on SObject field (not flagged - safe navigation cannot be used)
    Contact contact = getContact();
    if (contact != null) {
      contact.LastName.addError('Required field');
    }

    // Valid: Ternary operator (handled by PreferNullCoalescingOverTernary rule)
    String name = acc != null ? acc.Name : null;

    // Valid: Static method call (not flagged - safe navigation cannot be used)
    // String.format() is a static method, ReferenceExpression[1] = 'String' != variable name
    String className = 'MyClass';
    if (className != null) {
      String result = String.format('{0}', 'hello world');
    }

    // Valid: Static method call on class (not flagged - safe navigation cannot be used)
    // Integer.valueOf() is a static method, not an instance method
    String methodName = 'valueOf';
    if (methodName != null) {
      Integer value = Integer.valueOf('123');
    }

    // Valid: Static field access (not flagged - safe navigation cannot be used)
    // Integer.MAX_VALUE is a static field, not an instance field
    String varName = 'MAX_VALUE';
    if (varName != null) {
      Integer max = Integer.MAX_VALUE;
    }

    // Valid: Type.class (not flagged - safe navigation cannot be used)
    // Type.class is a compile-time constant
    String typeName2 = 'Account';
    if (typeName2 != null) {
      Type t = Account.class;
    }

    // Note: Additional edge cases (Namespace.Class, Trigger.new, Flow.interview, Page.pageName,
    // increment/decrement operators, etc.) are documented in
    // PreferSafeNavigationOperatorEdgeCases.cls test fixture

    // Valid: SOQL bind expression (not flagged - safe navigation cannot be used)
    // Safe navigation cannot be used in SOQL bind expressions
    Account queryAccount = getAccount();
    if (queryAccount != null) {
      List<Account> accounts = [SELECT Name FROM Account WHERE Id = :queryAccount.Id];
      // Cannot use: [SELECT Name FROM Account WHERE Id = :queryAccount?.Id];
      // Safe navigation operator is not allowed in SOQL bind expressions
    }
  }

  private Account getAccount() {
    return new Account();
  }

  private Contact getContact() {
    return new Contact();
  }
}

