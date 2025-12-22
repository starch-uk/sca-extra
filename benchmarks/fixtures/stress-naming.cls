/**
 * Stress test for naming rules
 * Contains 100+ violations across all naming rules
 */

public class StressNaming {
  // 30 violations: NoSingleLetterVariableNames
  public void method1() {
    Integer x = 5;
    Integer y = 10;
    Integer z = 15;
    String a = 'test';
    String b = 'value';
    String c = 'data';
    Boolean p = true;
    Boolean q = false;
    Boolean r = true;
    Decimal d = 1.5;
    Decimal e = 2.5;
    Decimal f = 3.5;
    Date g = Date.today();
    Date h = Date.today();
    Date j = Date.today();
    DateTime k = DateTime.now();
    DateTime l = DateTime.now();
    DateTime m = DateTime.now();
    Time n = Time.newInstance(12, 0, 0, 0);
    Time o = Time.newInstance(13, 0, 0, 0);
    Time p2 = Time.newInstance(14, 0, 0, 0);
    Blob q2 = Blob.valueOf('test');
    Blob r2 = Blob.valueOf('value');
    Blob s = Blob.valueOf('data');
    Id t = '001000000000000AAA';
    Id u = '001000000000000BBB';
    Id v = '001000000000000CCC';
    Object w = new Object();
    Object x2 = new Object();
    Object y2 = new Object();
  }

  // 50 violations: NoAbbreviations
  public void method2() {
    Integer ctx = 0;
    Integer idx = 5;
    String msg = 'test';
    String cfg = 'config';
    Integer val = 10;
    Account acc = new Account();
    Contact con = new Contact();
    Opportunity opp = new Opportunity();
    String param = 'value';
    Integer len = 100;
    String src = 'source';
    String dest = 'destination';
    String dst = 'destination';
    Integer pos = 1;
    String mgr = 'manager';
    String svc = 'service';
    String util = 'utility';
    String calc = 'calculate';
    String init = 'initialize';
    String ref = 'reference';
    String desc = 'description';
    String impl = 'implementation';
    String repo = 'repository';
    String col = 'collection';
    String hdr = 'header';
    String doc = 'document';
    String spec = 'specification';
    String req = 'request';
    String res = 'response';
    String resp = 'response';
    String fmt = 'format';
    String lbl = 'label';
    String opt = 'option';
    String addr = 'address';
    String org = 'organization';
    Integer cnt = 5;
    String txt = 'text';
    String num = 'number';
    String str = 'string';
    String obj = 'object';
    String arr = 'array';
    String lst = 'list';
    String map = 'map';
    String set = 'set';
    String fn = 'function';
    String var = 'variable';
    String const = 'constant';
    String temp = 'temporary';
    String tmp = 'temporary';
    String curr = 'current';
    String prev = 'previous';
    String next = 'next';
  }

  // 10 violations: VariablesMustNotShareNamesWithClasses
  public void method3() {
    Account Account = new Account();
    Contact Contact = new Contact();
    Opportunity Opportunity = new Opportunity();
    User User = new User();
    Profile Profile = new Profile();
    Role Role = new Role();
    Group Group = new Group();
    Queue Queue = new Queue();
    RecordType RecordType = new RecordType();
    CustomObject CustomObject = new CustomObject();
  }

  // 5 violations: InnerClassesMustBeOneWord
  public class Inner_Class_1 {}
  public class Inner_Class_2 {}
  public class Multi_Word_Class {}
  public class Test_Inner_Class {}
  public class Another_Inner_Class {}
}

