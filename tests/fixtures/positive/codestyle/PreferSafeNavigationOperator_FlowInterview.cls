public class PreferSafeNavigationOperator_FlowInterview {
  // Valid: Flow.Interview.{flowName} is a runtime constant (namespace expression)
  // It should NOT be flagged because it's not a VariableExpression
  // The rule checks for VariableExpression[@Image != 'null'] which won't match Flow.Interview.MyFlow

  public void testFlowInterview() {
    // Valid: Flow.Interview.{flowName} used directly in null-check condition
    // Flow.Interview.MyFlow is a compile-time constant, not a variable
    if (Flow.Interview.MyFlow != null) {
      Flow.Interview.MyFlow.start();
      // Should NOT be flagged - Flow.Interview.MyFlow is a namespace expression
    }
  }

  public void testFlowInterviewOtherFlow() {
    // Valid: Flow.Interview with different flow name
    if (Flow.Interview.TestFlow != null) {
      Flow.Interview.TestFlow.start();
      // Should NOT be flagged - Flow.Interview.TestFlow is a namespace expression
    }
  }

  public void testFlowInterviewStartMethod() {
    // Valid: Flow.Interview with start method call
    if (Flow.Interview.MyFlow != null) {
      Flow.Interview flow = Flow.Interview.MyFlow;
      flow.start();
      // Should NOT be flagged - Flow.Interview.MyFlow is a namespace expression
    }
  }
}
