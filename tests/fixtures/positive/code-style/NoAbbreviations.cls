public class Example {
  // ===== VALID VARIABLES =====
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

  // ===== VALID METHOD PARAMETERS - Full words =====
  public void processAccount(Account account) {
    // Valid: full word 'account'
  }

  public void configure(String configuration) {
    // Valid: full word 'configuration'
  }

  public void setContext(String context) {
    // Valid: full word 'context'
  }

  public void setIndex(Integer index) {
    // Valid: full word 'index'
  }

  public void sendMessage(String message) {
    // Valid: full word 'message'
  }

  public void setValue(Integer value) {
    // Valid: full word 'value'
  }

  public void processContact(Contact contact) {
    // Valid: full word 'contact'
  }

  public void processOpportunity(Opportunity opportunity) {
    // Valid: full word 'opportunity'
  }

  public void setParameter(String parameter) {
    // Valid: full word 'parameter'
  }

  public void setLength(Integer length) {
    // Valid: full word 'length'
  }

  public void setSource(String source) {
    // Valid: full word 'source'
  }

  public void setDestination(String destination) {
    // Valid: full word 'destination'
  }

  // ===== VALID METHOD PARAMETERS - Allowed suffixes (Id, Api, Html, Url) =====
  public void processAccount(String accountId) {
    // Valid: 'Id' suffix is allowed
  }

  public void setUserId(Integer userId) {
    // Valid: 'Id' suffix is allowed
  }

  public void setApiUrl(String apiUrl) {
    // Valid: 'Api' and 'Url' are allowed suffixes
  }

  public void setHtmlContent(String htmlContent) {
    // Valid: 'Html' suffix is allowed
  }

  public void processRecord(String recordId) {
    // Valid: 'Id' suffix is allowed
  }

  public void setContactId(String contactId) {
    // Valid: 'Id' suffix is allowed
  }

  public void setOpportunityId(String opportunityId) {
    // Valid: 'Id' suffix is allowed
  }

  public void setApiEndpoint(String apiEndpoint) {
    // Valid: 'Api' prefix is allowed
  }

  public void setUrlPath(String urlPath) {
    // Valid: 'Url' prefix is allowed
  }

  public void setHtmlTemplate(String htmlTemplate) {
    // Valid: 'Html' prefix is allowed
  }

  // ===== VALID METHOD PARAMETERS - Allowed prefixes (test) =====
  public void testMethod(String testCtx) {
    // Valid: 'test' prefix allows abbreviations like 'ctx'
  }

  public void testSetup(String testCfg) {
    // Valid: 'test' prefix allows abbreviations like 'cfg'
  }

  public void testProcess(Integer testAcc) {
    // Valid: 'test' prefix allows abbreviations like 'acc'
  }

  public void testConfiguration(String testCfg) {
    // Valid: 'test' prefix allows abbreviations like 'cfg'
  }

  public void testContext(String testCtx) {
    // Valid: 'test' prefix allows abbreviations like 'ctx'
  }

  public void testAccount(Account testAcc) {
    // Valid: 'test' prefix allows abbreviations like 'acc'
  }

  // ===== VALID METHOD PARAMETERS - Multiple parameters with allowed suffixes =====
  public void processRecords(String accountId, String contactId, String opportunityId) {
    // Valid: all parameters have allowed 'Id' suffix
  }

  public void setApiData(String apiUrl, String apiKey, String apiSecret) {
    // Valid: all parameters have allowed 'Api' prefix
  }

  public void renderContent(String htmlContent, String htmlTemplate, String htmlStyle) {
    // Valid: all parameters have allowed 'Html' prefix
  }

  // ===== VALID METHOD PARAMETERS - Constructor parameters =====
  public Example(String configuration, Integer index) {
    // Valid: full words in constructor parameters
  }

  public Example(String accountId, String contactId) {
    // Valid: allowed 'Id' suffix in constructor parameters
  }

  public Example(String testCfg, String testCtx) {
    // Valid: 'test' prefix allows abbreviations in constructor parameters
  }

  // ===== VALID METHOD PARAMETERS - Complex scenarios =====
  public void processData(String accountId, Account account, String testCfg) {
    // Valid: mix of allowed suffix, full word, and test prefix
  }

  public void updateRecord(String recordId, String apiUrl, String htmlContent) {
    // Valid: multiple allowed suffixes
  }

  public void testProcessData(String testCtx, String testCfg, Integer testAcc) {
    // Valid: multiple test-prefixed parameters
  }

  // ===== VALID METHOD PARAMETERS - Edge cases =====
  public void setAccountId(String accountId) {
    // Valid: 'Id' suffix even when 'account' could be abbreviated
  }

  public void setApiAccountId(String apiAccountId) {
    // Valid: 'Api' prefix and 'Id' suffix
  }

  public void setHtmlAccountId(String htmlAccountId) {
    // Valid: 'Html' prefix and 'Id' suffix
  }

  public void setUrlAccountId(String urlAccountId) {
    // Valid: 'Url' prefix and 'Id' suffix
  }

  public void testAccountId(String testAccountId) {
    // Valid: 'test' prefix and 'Id' suffix
  }

  // ===== VALID CLASS FIELDS - Full words =====
  private Account account;
  // Valid: full word 'account'

  private String configuration;
  // Valid: full word 'configuration'

  private String context;
  // Valid: full word 'context'

  private Integer index;
  // Valid: full word 'index'

  private String message;
  // Valid: full word 'message'

  private Integer value;
  // Valid: full word 'value'

  private Contact contact;
  // Valid: full word 'contact'

  private Opportunity opportunity;
  // Valid: full word 'opportunity'

  private String parameter;
  // Valid: full word 'parameter'

  private Integer length;
  // Valid: full word 'length'

  private String source;
  // Valid: full word 'source'

  private String destination;
  // Valid: full word 'destination'

  // ===== VALID CLASS FIELDS - Allowed suffixes (Id, Api, Html, Url) =====
  private String accountId;
  // Valid: 'Id' suffix is allowed

  private Integer userId;
  // Valid: 'Id' suffix is allowed

  private String apiUrl;
  // Valid: 'Api' and 'Url' are allowed suffixes

  private String htmlContent;
  // Valid: 'Html' suffix is allowed

  private String recordId;
  // Valid: 'Id' suffix is allowed

  private String contactId;
  // Valid: 'Id' suffix is allowed

  private String opportunityId;
  // Valid: 'Id' suffix is allowed

  private String apiEndpoint;
  // Valid: 'Api' prefix is allowed

  private String urlPath;
  // Valid: 'Url' prefix is allowed

  private String htmlTemplate;
  // Valid: 'Html' prefix is allowed

  // ===== VALID CLASS FIELDS - Allowed prefixes (test) =====
  private String testCtx;
  // Valid: 'test' prefix allows abbreviations like 'ctx'

  private String testCfg;
  // Valid: 'test' prefix allows abbreviations like 'cfg'

  private Integer testAcc;
  // Valid: 'test' prefix allows abbreviations like 'acc'

  private String testConfiguration;
  // Valid: 'test' prefix allows abbreviations like 'cfg'

  private String testContext;
  // Valid: 'test' prefix allows abbreviations like 'ctx'

  private Account testAccount;
  // Valid: 'test' prefix allows abbreviations like 'acc'

  // ===== VALID CLASS FIELDS - Static fields =====
  private static String staticAccountId;
  // Valid: 'Id' suffix is allowed in static fields

  private static final String STATIC_API_URL = 'https://example.com';
  // Valid: 'Api' and 'Url' suffixes are allowed

  // ===== VALID CLASS FIELDS - Public fields =====
  public String publicAccountId;
  // Valid: 'Id' suffix is allowed in public fields

  public String publicApiUrl;
  // Valid: 'Api' and 'Url' suffixes are allowed

  // ===== VALID CLASS FIELDS - Protected fields =====
  protected String protectedAccountId;
  // Valid: 'Id' suffix is allowed in protected fields

  protected String protectedHtmlContent;
  // Valid: 'Html' suffix is allowed

  // ===== VALID CLASS FIELDS - Complex scenarios =====
  private String accountId;
  private Account account;
  private String testCfg;
  // Valid: mix of allowed suffix, full word, and test prefix

  private String recordId;
  private String apiUrl;
  private String htmlContent;
  // Valid: multiple allowed suffixes

  private String testCtx;
  private String testCfg;
  private Integer testAcc;
  // Valid: multiple test-prefixed fields

  // ===== VALID CLASS FIELDS - Edge cases =====
  private String accountId;
  // Valid: 'Id' suffix even when 'account' could be abbreviated

  private String apiAccountId;
  // Valid: 'Api' prefix and 'Id' suffix

  private String htmlAccountId;
  // Valid: 'Html' prefix and 'Id' suffix

  private String urlAccountId;
  // Valid: 'Url' prefix and 'Id' suffix

  private String testAccountId;
  // Valid: 'test' prefix and 'Id' suffix
}

