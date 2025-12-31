public class PreferSafeNavigationOperator_TriggerNew {
  // Valid: Trigger.new is a runtime constant (namespace expression)
  // It should NOT be flagged because it's not a VariableExpression
  // The rule checks for VariableExpression[@Image != 'null'] which won't match Trigger.new

  public void testTriggerNew() {
    // Valid: Trigger.new used directly in null-check condition
    // Trigger.new is a compile-time constant, not a variable
    if (Trigger.new != null) {
      Integer count = Trigger.new.size();
      // Should NOT be flagged - Trigger.new is a namespace expression
    }
  }

  public void testTriggerOld() {
    // Valid: Trigger.old is also a runtime constant
    if (Trigger.old != null) {
      Integer count = Trigger.old.size();
      // Should NOT be flagged - Trigger.old is a namespace expression
    }
  }

  public void testTriggerNewMap() {
    // Valid: Trigger.newMap is also a runtime constant
    if (Trigger.newMap != null) {
      Integer count = Trigger.newMap.size();
      // Should NOT be flagged - Trigger.newMap is a namespace expression
    }
  }

  public void testTriggerOldMap() {
    // Valid: Trigger.oldMap is also a runtime constant
    if (Trigger.oldMap != null) {
      Integer count = Trigger.oldMap.size();
      // Should NOT be flagged - Trigger.oldMap is a namespace expression
    }
  }
}
