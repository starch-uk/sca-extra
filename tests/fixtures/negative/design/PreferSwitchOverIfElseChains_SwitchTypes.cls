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
        
        // Violation: Schema.SObjectType (switch-compatible)
        Schema.SObjectType objType = Account.sObjectType;
        if (objType == Account.sObjectType) {
            processAccount();
        } else if (objType == Contact.sObjectType) {
            processContact();
        } else if (objType == Opportunity.sObjectType) {
            processOpportunity();
        }
        
        // Violation: SObjectType (switch-compatible)
        SObjectType objType2 = Account.sObjectType;
        if (objType2 == Account.sObjectType) {
            processAccount2();
        } else if (objType2 == Contact.sObjectType) {
            processContact2();
        }
        
        // Violation: SObject instance - extract type first (switch-compatible)
        SObject obj = getSObject();
        Schema.SObjectType objType3 = obj.getSObjectType();
        if (objType3 == Account.sObjectType) {
            processAccount3();
        } else if (objType3 == Contact.sObjectType) {
            processContact3();
        } else if (objType3 == Opportunity.sObjectType) {
            processOpportunity3();
        }
        
        // Violation: Account instance - extract type first (switch-compatible)
        Account acc2 = new Account();
        Schema.SObjectType accType2 = acc2.getSObjectType();
        if (accType2 == Account.sObjectType) {
            processAccount4();
        } else if (accType2 == Contact.sObjectType) {
            processContact4();
        }
        
        // Violation: SObject instance - direct instance comparison pattern (matches Salesforce doc example)
        // Note: In practice, if-else chains with sObject instances use getSObjectType() comparisons
        // but the switch statement supports direct sObject instance switching as shown in docs
        SObject record = getRecord();
        Schema.SObjectType recordType = record.getSObjectType();
        if (recordType == Account.sObjectType) {
            Account accRec = (Account) record;
            processAccount5();
        } else if (recordType == Contact.sObjectType) {
            Contact conRec = (Contact) record;
            processContact5();
        } else if (recordType == Opportunity.sObjectType) {
            Opportunity oppRec = (Opportunity) record;
            processOpportunity5();
        }
    }
    
    public enum MyEnum {
        VALUE1, VALUE2, VALUE3
    }
    
    private SObject getSObject() {
        return new Account();
    }
    
    private SObject getRecord() {
        return new Account();
    }
    
    private void processAccount() {}
    private void processContact() {}
    private void processOpportunity() {}
    private void processAccount2() {}
    private void processContact2() {}
    private void processAccount3() {}
    private void processContact3() {}
    private void processOpportunity3() {}
    private void processAccount4() {}
    private void processContact4() {}
    private void processAccount5() {}
    private void processContact5() {}
    private void processOpportunity5() {}
}

