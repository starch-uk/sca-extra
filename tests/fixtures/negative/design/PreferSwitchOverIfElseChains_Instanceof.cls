public class Example {
    public void instanceofMethod() {
        // Violation: SObject instanceof pattern (switch-compatible)
        SObject sobject = getRecord();
        if (sobject instanceof Account) {
            Account a = (Account) sobject;
            System.debug('account ' + a);
        } else if (sobject instanceof Contact) {
            Contact c = (Contact) sobject;
            System.debug('contact ' + c);
        } else if (sobject instanceof Opportunity) {
            Opportunity o = (Opportunity) sobject;
            System.debug('opportunity ' + o);
        } else {
            System.debug('default');
        }
        
        // Violation: Another instanceof pattern
        SObject obj = getRecord();
        if (obj instanceof Account) {
            Account acc = (Account) obj;
            processAccount(acc);
        } else if (obj instanceof Contact) {
            Contact con = (Contact) obj;
            processContact(con);
        }
    }
    
    private SObject getRecord() {
        return new Account();
    }
    
    private void processAccount(Account a) {}
    private void processContact(Contact c) {}
}

