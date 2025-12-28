// Valid: Interface with descriptive name (not ending with Callback)
public interface PaymentHandler {
    void onSuccess();
    void onError(String error);
}

// Valid: Interface not ending with 'Callback'
public interface EventListener {
    void handleEvent(String event);
}

// Valid: Interface with different suffix
public interface PaymentProcessor {
    void processPayment(Decimal amount);
}

// Valid: Interface with 'Callback' in the middle (not at the end)
public interface CallbackHandler {
    void handleCallback(String data);
}

// Valid: Regular class (not an interface)
public class PaymentCallback {
    public void process() {
        // ...
    }
}

