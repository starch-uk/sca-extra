// Violation: Interface ending with 'Callback'
public class ListRenderStrategy {
    private TableRenderer tableRenderer;
    private ListRenderCallback listCallback;

    public interface ListRenderCallback {
        void render(String prefix, String key, List<Object> items);
    }

    public ListRenderStrategy(TableRenderer tableRenderer) {
        this.tableRenderer = tableRenderer;
    }

    public void setCallback(ListRenderCallback callbackValue) {
        listCallback = callbackValue;
    }

    public void renderList(String prefix, String key, List<Object> items) {
        if (items.isEmpty()) {
            tableRenderer.renderEmpty(prefix, key);
            return;
        }
        listCallback.render(prefix, key, items);
    }
}

