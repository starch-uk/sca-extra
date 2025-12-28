public class Example {
  // ===== VARIABLE VIOLATIONS =====
  public void invalidMethod() {
    Integer ctx = 0;
    // Violation: abbreviation 'ctx' not allowed

    Integer idx = 5;
    // Violation: abbreviation 'idx' not allowed

    String msg = 'test';
    // Violation: abbreviation 'msg' not allowed

    String cfg = 'config';
    // Violation: abbreviation 'cfg' not allowed

    Integer val = 10;
    // Violation: abbreviation 'val' not allowed

    Account acc = new Account();
    // Violation: abbreviation 'acc' not allowed

    Contact con = new Contact();
    // Violation: abbreviation 'con' not allowed

    Opportunity opp = new Opportunity();
    // Violation: abbreviation 'opp' not allowed

    String param = 'value';
    // Violation: abbreviation 'param' not allowed (should be 'parameter')

    Integer len = 100;
    // Violation: abbreviation 'len' not allowed

    String src = 'source';
    // Violation: abbreviation 'src' not allowed

    String dest = 'destination';
    // Violation: abbreviation 'dest' not allowed

    String myCtx = 'value';
    // Violation: 'ctx' abbreviation not allowed without 'test' prefix

    Integer myCfg = 10;
    // Violation: 'cfg' abbreviation not allowed without 'test' prefix

    Account myAcc = new Account();
    // Violation: 'acc' abbreviation not allowed without 'test' prefix
  }

  // ===== METHOD PARAMETER VIOLATIONS - Single abbreviations =====
  public void processAccount(Account acc) {
    // Violation: abbreviation 'acc' in parameter
  }

  public void configure(String cfg) {
    // Violation: abbreviation 'cfg' in parameter
  }

  public void setContext(String ctx) {
    // Violation: abbreviation 'ctx' in parameter
  }

  public void setIndex(Integer idx) {
    // Violation: abbreviation 'idx' in parameter
  }

  public void sendMessage(String msg) {
    // Violation: abbreviation 'msg' in parameter
  }

  public void setValue(Integer val) {
    // Violation: abbreviation 'val' in parameter
  }

  public void processContact(Contact con) {
    // Violation: abbreviation 'con' in parameter
  }

  public void processOpportunity(Opportunity opp) {
    // Violation: abbreviation 'opp' in parameter
  }

  public void setParameter(String param) {
    // Violation: abbreviation 'param' in parameter
  }

  public void setLength(Integer len) {
    // Violation: abbreviation 'len' in parameter
  }

  public void setSource(String src) {
    // Violation: abbreviation 'src' in parameter
  }

  public void setDestination(String dest) {
    // Violation: abbreviation 'dest' in parameter
  }

  // ===== METHOD PARAMETER VIOLATIONS - Abbreviations in compound names =====
  public void processAccountData(Account myAcc) {
    // Violation: 'acc' abbreviation not allowed without 'test' prefix
  }

  public void configureSettings(String myCfg) {
    // Violation: 'cfg' abbreviation not allowed without 'test' prefix
  }

  public void setContextValue(String myCtx) {
    // Violation: 'ctx' abbreviation not allowed without 'test' prefix
  }

  public void processAccountList(List<Account> accList) {
    // Violation: 'acc' abbreviation in compound name
  }

  public void setConfigValue(String cfgValue) {
    // Violation: 'cfg' abbreviation in compound name
  }

  public void setContextData(String ctxData) {
    // Violation: 'ctx' abbreviation in compound name
  }

  public void processAccountId(String accId) {
    // Violation: 'acc' abbreviation (Id suffix is allowed, but 'acc' is not)
  }

  // ===== METHOD PARAMETER VIOLATIONS - Multiple parameters =====
  public void processData(Account acc, String cfg, Integer idx) {
    // Violation: multiple abbreviations in parameters
  }

  public void updateRecord(Contact con, Opportunity opp, String msg) {
    // Violation: multiple abbreviations in parameters
  }

  public void processRequest(String req, String resp, String svc) {
    // Violation: multiple abbreviations in parameters
  }

  // ===== METHOD PARAMETER VIOLATIONS - Constructor parameters =====
  public Example(String cfg, Integer idx) {
    // Violation: abbreviations in constructor parameters
  }

  // ===== METHOD PARAMETER VIOLATIONS - Additional abbreviations =====
  public void setAddress(String addr) {
    // Violation: abbreviation 'addr' in parameter
  }

  public void setAttribute(String attr) {
    // Violation: abbreviation 'attr' in parameter
  }

  public void calculate(Integer calc) {
    // Violation: abbreviation 'calc' in parameter
  }

  public void setColumn(String col) {
    // Violation: abbreviation 'col' in parameter
  }

  public void setCurrent(String curr) {
    // Violation: abbreviation 'curr' in parameter
  }

  public void setDescription(String desc) {
    // Violation: abbreviation 'desc' in parameter
  }

  public void setDocument(String doc) {
    // Violation: abbreviation 'doc' in parameter
  }

  public void setDestination(String dst) {
    // Violation: abbreviation 'dst' in parameter
  }

  public void setElement(String elem) {
    // Violation: abbreviation 'elem' in parameter
  }

  public void setFormat(String fmt) {
    // Violation: abbreviation 'fmt' in parameter
  }

  public void setHeader(String hdr) {
    // Violation: abbreviation 'hdr' in parameter
  }

  public void setImplementation(String impl) {
    // Violation: abbreviation 'impl' in parameter
  }

  public void setInitialization(String init) {
    // Violation: abbreviation 'init' in parameter
  }

  public void setLabel(String lbl) {
    // Violation: abbreviation 'lbl' in parameter
  }

  public void setManager(String mgr) {
    // Violation: abbreviation 'mgr' in parameter
  }

  public void setOption(String opt) {
    // Violation: abbreviation 'opt' in parameter
  }

  public void setOrganization(String org) {
    // Violation: abbreviation 'org' in parameter
  }

  public void setPosition(Integer pos) {
    // Violation: abbreviation 'pos' in parameter
  }

  public void setPrevious(String prev) {
    // Violation: abbreviation 'prev' in parameter
  }

  public void setReference(String ref) {
    // Violation: abbreviation 'ref' in parameter
  }

  public void setRepository(String repo) {
    // Violation: abbreviation 'repo' in parameter
  }

  public void setRequest(String req) {
    // Violation: abbreviation 'req' in parameter
  }

  public void setResponse(String res) {
    // Violation: abbreviation 'res' in parameter
  }

  public void setResponse(String resp) {
    // Violation: abbreviation 'resp' in parameter
  }

  public void setSpecification(String spec) {
    // Violation: abbreviation 'spec' in parameter
  }

  public void setService(String svc) {
    // Violation: abbreviation 'svc' in parameter
  }

  public void setUtility(String util) {
    // Violation: abbreviation 'util' in parameter
  }

  // ===== CLASS FIELD VIOLATIONS - Single abbreviations =====
  private Account acc;
  // Violation: abbreviation 'acc' in field

  private String cfg;
  // Violation: abbreviation 'cfg' in field

  private String ctx;
  // Violation: abbreviation 'ctx' in field

  private Integer idx;
  // Violation: abbreviation 'idx' in field

  private String msg;
  // Violation: abbreviation 'msg' in field

  private Integer val;
  // Violation: abbreviation 'val' in field

  private Contact con;
  // Violation: abbreviation 'con' in field

  private Opportunity opp;
  // Violation: abbreviation 'opp' in field

  private String param;
  // Violation: abbreviation 'param' in field

  private Integer len;
  // Violation: abbreviation 'len' in field

  private String src;
  // Violation: abbreviation 'src' in field

  private String dest;
  // Violation: abbreviation 'dest' in field

  // ===== CLASS FIELD VIOLATIONS - Abbreviations in compound names =====
  private Account myAcc;
  // Violation: 'acc' abbreviation not allowed without 'test' prefix

  private String myCfg;
  // Violation: 'cfg' abbreviation not allowed without 'test' prefix

  private String myCtx;
  // Violation: 'ctx' abbreviation not allowed without 'test' prefix

  private List<Account> accList;
  // Violation: 'acc' abbreviation in compound name

  private String cfgValue;
  // Violation: 'cfg' abbreviation in compound name

  private String ctxData;
  // Violation: 'ctx' abbreviation in compound name

  // ===== CLASS FIELD VIOLATIONS - Additional abbreviations =====
  private String addr;
  // Violation: abbreviation 'addr' in field

  private String attr;
  // Violation: abbreviation 'attr' in field

  private Integer calc;
  // Violation: abbreviation 'calc' in field

  private String col;
  // Violation: abbreviation 'col' in field

  private String curr;
  // Violation: abbreviation 'curr' in field

  private String desc;
  // Violation: abbreviation 'desc' in field

  private String doc;
  // Violation: abbreviation 'doc' in field

  private String dst;
  // Violation: abbreviation 'dst' in field

  private String elem;
  // Violation: abbreviation 'elem' in field

  private String fmt;
  // Violation: abbreviation 'fmt' in field

  private String hdr;
  // Violation: abbreviation 'hdr' in field

  private String impl;
  // Violation: abbreviation 'impl' in field

  private String init;
  // Violation: abbreviation 'init' in field

  private String lbl;
  // Violation: abbreviation 'lbl' in field

  private String mgr;
  // Violation: abbreviation 'mgr' in field

  private String opt;
  // Violation: abbreviation 'opt' in field

  private String org;
  // Violation: abbreviation 'org' in field

  private Integer pos;
  // Violation: abbreviation 'pos' in field

  private String prev;
  // Violation: abbreviation 'prev' in field

  private String ref;
  // Violation: abbreviation 'ref' in field

  private String repo;
  // Violation: abbreviation 'repo' in field

  private String req;
  // Violation: abbreviation 'req' in field

  private String res;
  // Violation: abbreviation 'res' in field

  private String resp;
  // Violation: abbreviation 'resp' in field

  private String spec;
  // Violation: abbreviation 'spec' in field

  private String svc;
  // Violation: abbreviation 'svc' in field

  private String util;
  // Violation: abbreviation 'util' in field

  // ===== CLASS FIELD VIOLATIONS - Static fields =====
  private static String staticCfg;
  // Violation: 'cfg' abbreviation in static field

  private static Integer staticIdx;
  // Violation: 'idx' abbreviation in static field

  // ===== CLASS FIELD VIOLATIONS - Public fields =====
  public String publicCtx;
  // Violation: 'ctx' abbreviation in public field

  public Integer publicVal;
  // Violation: 'val' abbreviation in public field

  // ===== CLASS FIELD VIOLATIONS - Protected fields =====
  protected String protectedCfg;
  // Violation: 'cfg' abbreviation in protected field

  protected Account protectedAcc;
  // Violation: 'acc' abbreviation in protected field
}

