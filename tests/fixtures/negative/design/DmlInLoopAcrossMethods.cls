public class DmlInLoopAcrossMethods {
    // Violation: Loop calls method that performs DML
    public void processAccounts(List<Account> accounts) {
        for (Account acc : accounts) {
            saveAccount(acc);  // Method call in loop
        }
    }
    
    // Violation: Method called from loop performs DML
    private void saveAccount(Account acc) {
        insert acc;  // DML operation
    }
    
    // Violation: Loop calls method that performs DML via Database class
    public void updateContacts(List<Contact> contacts) {
        for (Contact con : contacts) {
            updateContact(con);
        }
    }
    
    private void updateContact(Contact con) {
        Database.update(con);  // DML via Database class
    }
    
    // Violation: For loop (not for-each) calling DML method
    public void deleteRecords(List<Opportunity> opps) {
        for (Integer i = 0; i < opps.size(); i++) {
            deleteOpportunity(opps[i]);
        }
    }
    
    private void deleteOpportunity(Opportunity opp) {
        delete opp;  // DML operation
    }
    
    // Violation: Multiple DML operations in called method
    public void processLeads(List<Lead> leads) {
        for (Lead l : leads) {
            upsertLead(l);
        }
    }
    
    private void upsertLead(Lead l) {
        upsert l;  // DML operation
    }
}
