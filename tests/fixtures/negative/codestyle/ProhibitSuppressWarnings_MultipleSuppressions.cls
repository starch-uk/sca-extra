// Violation: Multiple suppressions in same class
@SuppressWarnings('PMD.UnusedLocalVariable')
public class Example11 {
    public void method1() {
        int unused1 = 42; // NOPMD
    }
    
    public void method2() {
        int unused2 = 42; // NOPMD - temporary
    }
}

