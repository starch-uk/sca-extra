public class Example {
  public void validMethod() {
    Integer index = 0;
    // Valid: 'i' is allowed, but 'index' is better

    Integer count = 5;
    // Valid: full word

    String accountId = '123';
    // Valid: 'Id' suffix is allowed

    String apiUrl = 'https://example.com';
    // Valid: 'Api' and 'Url' are allowed acronyms

    String htmlContent = '<div></div>';
    // Valid: 'Html' is allowed acronym

    Integer userId = 123;
    // Valid: 'Id' suffix is allowed

    for (Integer i = 0; i < 10; i++) {
      // Valid: 'i' is allowed for loop counters
    }

    try {
      // ...
    } catch (Exception e) {
      // Valid: 'e' is allowed for exceptions
    }

    String testCtx = 'value';
    // Valid: 'test' prefix allows abbreviations like 'ctx'

    String testCfg = 'config';
    // Valid: 'test' prefix allows abbreviations like 'cfg'

    Integer testAcc = 5;
    // Valid: 'test' prefix allows abbreviations like 'acc'
  }
}

