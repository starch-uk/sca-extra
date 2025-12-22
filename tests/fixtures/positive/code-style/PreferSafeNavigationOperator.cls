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
  }

  private Account getAccount() {
    return new Account();
  }
}

