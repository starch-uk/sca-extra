public class Example {
    public void testMethod() {
        // Valid: Single argument on one line
        processData(getValue());

        // Valid: Zero arguments on one line
        processData();

        // Valid: Multiple arguments can be multi-line
        processData(
            getValue1(),
            getValue2()
        );

        // Valid: List declaration as argument (excluded from rule)
        processList(new List<String>{
            'item1',
            'item2'
        });

        // Valid: Map declaration as argument (excluded from rule)
        processMap(new Map<String, String>{
            'key1' => 'value1',
            'key2' => 'value2'
        });

        // Valid: Single item list as argument (excluded from rule)
        processList(new List<String>{
            'item1'
        });

        // Valid: Single entry map as argument (excluded from rule)
        processMap(new Map<String, String>{
            'key1' => 'value1'
        });

        // Valid: Empty list as argument (excluded from rule)
        processList(new List<String>());

        // Valid: Empty map as argument (excluded from rule)
        processMap(new Map<String, String>());
    }
}

