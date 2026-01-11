// Valid: String with suppression text in different contexts
public class Example9 {
    public void method() {
        Map<String, String> map = new Map<String, String>{
            '@SuppressWarnings' => 'not allowed',
            'NOPMD' => 'also not allowed'
        };
    }
}

