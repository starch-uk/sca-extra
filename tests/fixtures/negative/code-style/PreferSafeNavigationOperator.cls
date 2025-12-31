public class Example {
  public void invalidMethod() {
    Account acc = getAccount();

    if (acc != null) {
      String name = acc.Name;
      // Violation: should use safe navigation operator
    }

    if (acc != null) {
      Integer size = acc.Contacts.size();
      // Violation: should use safe navigation operator
    }

    if (user != null) {
      String email = user.getEmail();
      // Violation: should use safe navigation operator
    }
  }

  private Account getAccount() {
    return new Account();
  }
}

