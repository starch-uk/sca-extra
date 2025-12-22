public class Example {
  public void validMethod() {
    Account acc = getAccount();

    String name = acc?.Name ?? 'Unknown';
    // Valid: using null coalescing operator

    Integer value = acc?.Contacts?.size() ?? 0;
    // Valid: using null coalescing operator

    String city = acc?.BillingCity ?? acc?.ShippingCity ?? 'N/A';
    // Valid: chained null coalescing
  }

  private Account getAccount() {
    return new Account();
  }
}

