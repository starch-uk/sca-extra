public class Example {
    public void method() {
        // Violation: String type (switch-compatible)
        String str = 'a';
        if (str == 'a') {
            processA();
        } else if (str == 'b') {
            processB();
        }
        
        // Violation: Integer type (switch-compatible)
        Integer num = 1;
        if (num == 1) {
            doOne();
        } else if (num == 2) {
            doTwo();
        } else if (num == 3) {
            doThree();
        }
        
        // Violation: Long type (switch-compatible)
        Long longNum = 1L;
        if (longNum == 1L) {
            processOne();
        } else if (longNum == 2L) {
            processTwo();
        }
        
        // Violation: Enum type (switch-compatible)
        MyEnum enumVal = MyEnum.VALUE1;
        if (enumVal == MyEnum.VALUE1) {
            processV1();
        } else if (enumVal == MyEnum.VALUE2) {
            processV2();
        } else if (enumVal == MyEnum.VALUE3) {
            processV3();
        }
        
        // Violation: sObject field (Type is String, switch-compatible)
        Account acc = new Account();
        String accType = acc.Type;
        if (accType == 'Customer') {
            processCustomer();
        } else if (accType == 'Partner') {
            processPartner();
        }
        
        // Violation: sObject field (LeadSource is String, switch-compatible)
        Contact con = new Contact();
        String leadSource = con.LeadSource;
        if (leadSource == 'Web') {
            processWeb();
        } else if (leadSource == 'Phone') {
            processPhone();
        } else if (leadSource == 'Email') {
            processEmail();
        }
    }
    
    public enum MyEnum {
        VALUE1, VALUE2, VALUE3
    }
}

