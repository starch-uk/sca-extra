public class DmlInLoopAcrossMethods {
    // Valid: Bulk DML outside loop
    public void processAccounts(List<Account> accounts) {
        List<Account> accountsToInsert = new List<Account>();
        for (Account acc : accounts) {
            acc.Name = 'Processed';
            accountsToInsert.add(acc);
        }
        insert accountsToInsert;  // Bulk DML outside loop
    }
    
    // Valid: Method called from loop does not perform DML
    public void validateAccounts(List<Account> accounts) {
        for (Account acc : accounts) {
            validateAccount(acc);
        }
    }
    
    private void validateAccount(Account acc) {
        if (acc.Name == null) {
            acc.Name = 'Unknown';
        }
    }
    
    // Valid: Loop calls method that only reads data
    public void processContacts(List<Contact> contacts) {
        for (Contact con : contacts) {
            String name = getContactName(con);
        }
    }
    
    private String getContactName(Contact con) {
        return con.FirstName + ' ' + con.LastName;
    }
    
    // Valid: DML in method but not called from loop
    public void saveAccount(Account acc) {
        insert acc;  // DML but not called from loop
    }
    
    // Valid: For loop without method calls
    public void processOpportunities(List<Opportunity> opps) {
        for (Integer i = 0; i < opps.size(); i++) {
            opps[i].Amount = 1000;
        }
        update opps;  // Bulk DML outside loop
    }
    
    // Valid: Method performs DML but is called outside loop
    public void processLeads(List<Lead> leads) {
        for (Lead l : leads) {
            l.Status = 'Open';
        }
        saveLeads(leads);  // Method called outside loop
    }
    
    private void saveLeads(List<Lead> leads) {
        insert leads;  // DML but called outside loop
    }
}
