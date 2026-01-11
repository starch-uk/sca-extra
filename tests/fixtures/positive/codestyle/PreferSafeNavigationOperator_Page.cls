public class PreferSafeNavigationOperator_Page {
  // Valid: Page.{pageName} is a runtime constant (namespace expression)
  // It should NOT be flagged because it's not a VariableExpression
  // The rule checks for VariableExpression[@Image != 'null'] which won't match Page.MyPage

  public void testPageReference() {
    // Valid: Page.{pageName} used directly in null-check condition
    // Page.MyPage is a compile-time constant, not a variable
    if (Page.MyPage != null) {
      String content = Page.MyPage.getContent().toString();
      // Should NOT be flagged - Page.MyPage is a namespace expression
    }
  }

  public void testPageReferenceOtherPage() {
    // Valid: Page with different page name
    if (Page.TestPage != null) {
      String content = Page.TestPage.getContent().toString();
      // Should NOT be flagged - Page.TestPage is a namespace expression
    }
  }

  public void testPageReferenceGetContent() {
    // Valid: Page with getContent method call
    if (Page.MyPage != null) {
      PageReference ref = Page.MyPage;
      Blob content = ref.getContent();
      // Should NOT be flagged - Page.MyPage is a namespace expression
    }
  }

  public void testPageReferenceGetUrl() {
    // Valid: Page with getUrl method call
    if (Page.MyPage != null) {
      String url = Page.MyPage.getUrl();
      // Should NOT be flagged - Page.MyPage is a namespace expression
    }
  }
}
