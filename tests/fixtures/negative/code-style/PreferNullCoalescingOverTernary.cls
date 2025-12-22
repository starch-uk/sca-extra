public class Example {
  public void invalidMethod() {
    Account acc = getAccount();

    String name = acc != null ? acc.Name : 'Unknown';
    // Violation: should use null coalescing operator

    Integer value = acc == null ? 0 : acc.Contacts.size();
    // Violation: should use null coalescing operator

    String city = acc != null ? acc.BillingCity : 'N/A';
    // Violation: should use null coalescing operator
  }

  private Account getAccount() {
    return new Account();
  }
}

