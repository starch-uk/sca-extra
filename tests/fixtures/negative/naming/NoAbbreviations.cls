public class Example {
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
  }
}

