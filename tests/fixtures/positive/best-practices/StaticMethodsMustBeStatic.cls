public class Example {
	private String instanceField;

	public void instanceMethod() {
		// Valid: uses instance field
		this.instanceField = 'test';
	}

	public void methodUsingThis() {
		// Valid: uses 'this'
		String value = this.instanceField;
	}

	public void methodUsingInstanceField() {
		// Valid: uses instance field directly
		String value = instanceField;
	}

	public static void staticMethod() {
		// Valid: already static
		Integer value = 5;
	}

	public abstract void abstractMethod();
	// Valid: abstract method

	public Example() {
		// Valid: constructor
	}

	// Abstract class example as inner class
	public abstract class AbstractClass {
		public void method() {
			// Valid: abstract class method
		}
	}

	// Property examples as inner class
	public class PropertyExamples {
		/** Base indentation level. */
		public Integer baseIndent { get; private set; }

		/**
		 * Check if the base indent is set.
		 * @return true if base indent is set
		 */
		public Boolean hasBaseIndent() {
			// Valid: uses property field
			if (baseIndent == null) {
				return false;
			}
			return true;
		}

		public Integer getBaseIndentValue() {
			// Valid: uses property field directly
			return baseIndent;
		}

		public void setBaseIndentValue(Integer value) {
			// Valid: uses property field in assignment
			baseIndent = value;
		}

		// Property with getter only
		public String name { get; }

		public String getName() {
			// Valid: uses property field
			return name;
		}

		// Property with setter only
		private String description { private get; set; }

		public void setDescription(String desc) {
			// Valid: uses property field
			description = desc;
		}

		// Multiple properties
		public Integer count { get; set; }
		public Boolean enabled { get; set; }

		public Boolean isConfigured() {
			// Valid: uses multiple property fields
			return count != null && enabled != null;
		}

		public void configure(Integer cnt, Boolean en) {
			// Valid: uses multiple property fields
			count = cnt;
			enabled = en;
		}

		// Property with this keyword
		public String title { get; set; }

		public String getTitle() {
			// Valid: uses property field with this
			return this.title;
		}

		// Property in conditional
		public Integer threshold { get; set; }

		public Boolean isAboveThreshold(Integer value) {
			// Valid: uses property field in condition
			return value > threshold;
		}

		// Property in method call
		public String prefix { get; set; }

		public String buildMessage(String suffix) {
			// Valid: uses property field in expression
			return prefix + suffix;
		}

		// Property in return statement
		public Integer maxValue { get; set; }

		public Integer getMaxValue() {
			// Valid: uses property field in return
			return maxValue;
		}

		// Property with different types
		public String textValue { get; set; }
		public Integer numericValue { get; set; }
		public Boolean booleanValue { get; set; }
		public List<String> listValue { get; set; }
		public Map<String, String> mapValue { get; set; }

		public Boolean hasAllValues() {
			// Valid: uses multiple property fields of different types
			return textValue != null 
				&& numericValue != null 
				&& booleanValue != null
				&& listValue != null
				&& mapValue != null;
		}

		// Property in complex expression
		public Integer multiplier { get; set; }

		public Integer calculate(Integer base) {
			// Valid: uses property field in calculation
			return base * multiplier;
		}

		// Property accessed in loop
		public List<String> items { get; set; }

		public void processItems() {
			// Valid: uses property field in loop
			for (String item : items) {
				System.debug(item);
			}
		}

		// Property in nested method call
		public String context { get; set; }

		public void logContext() {
			// Valid: uses property field as method argument
			System.debug('Context: ' + context);
		}

		// Property with getter/setter access
		public Integer value { get; private set; }

		public Integer getValue() {
			// Valid: uses property field
			return value;
		}

		private void setValueInternal(Integer val) {
			// Valid: uses property field in setter
			value = val;
		}

		// Property in ternary expression
		public Integer limit { get; set; }

		public Integer getLimitOrDefault(Integer defaultLimit) {
			// Valid: uses property field in ternary
			return limit != null ? limit : defaultLimit;
		}

		// Property in switch statement
		public String status { get; set; }

		public Integer getStatusCode() {
			// Valid: uses property field in switch
			switch on status {
				when 'active' {
					return 200;
				}
				when 'inactive' {
					return 404;
				}
				when else {
					return 500;
				}
			}
		}

		// Property with inheritance scenario
		public String baseProperty { get; set; }

		public Boolean hasBaseProperty() {
			// Valid: uses property field
			return baseProperty != null;
		}

		// Property in try-catch
		public String errorMessage { get; set; }

		public void handleError() {
			// Valid: uses property field in try-catch
			try {
				if (errorMessage != null) {
					System.debug(errorMessage);
				}
			} catch (Exception e) {
				errorMessage = e.getMessage();
			}
		}

		// Property with method chaining
		public String data { get; set; }

		public String processData() {
			// Valid: uses property field in method chain
			return data?.toUpperCase();
		}

		// Property in assignment expression
		public Integer counter { get; set; }

		public void increment() {
			// Valid: uses property field in assignment
			counter = counter + 1;
		}

		// Property with null coalescing
		public String defaultText { get; set; }

		public String getTextOrDefault(String fallback) {
			// Valid: uses property field with null coalescing
			return defaultText ?? fallback;
		}
	}

	// Other instance state patterns as inner class
	public class OtherInstanceStatePatterns {
		// Instance field access patterns
		private String field1;
		protected Integer field2;
		public Boolean field3;

		public void useField1() {
			// Valid: uses private instance field
			String value = field1;
		}

		public void useField2() {
			// Valid: uses protected instance field
			Integer num = field2;
		}

		public void useField3() {
			// Valid: uses public instance field
			Boolean flag = field3;
		}

		public void useMultipleFields() {
			// Valid: uses multiple instance fields
			String result = field1 + String.valueOf(field2) + String.valueOf(field3);
		}

		// Instance field with this keyword
		private String name;

		public void useThisField() {
			// Valid: uses instance field with this
			this.name = 'test';
		}

		public String getNameWithThis() {
			// Valid: uses instance field with this
			return this.name;
		}

		// Instance field in method call
		private Integer count;

		public void incrementCount() {
			// Valid: uses instance field in method call
			setCount(count + 1);
		}

		private void setCount(Integer value) {
			count = value;
		}

		// Instance field in conditional
		private Boolean enabled;

		public Boolean isEnabled() {
			// Valid: uses instance field in condition
			return enabled == true;
		}

		// Instance field in loop
		private List<String> items;

		public void processItems() {
			// Valid: uses instance field in loop
			for (String item : items) {
				System.debug(item);
			}
		}

		// Instance field in return
		private String message;

		public String getMessage() {
			// Valid: uses instance field in return
			return message;
		}

		// Instance field in assignment
		private Integer value;

		public void setValue(Integer val) {
			// Valid: uses instance field in assignment
			value = val;
		}

		// Instance field in complex expression
		private Integer multiplier;

		public Integer calculate(Integer base) {
			// Valid: uses instance field in calculation
			return base * multiplier;
		}

		// Instance field with null check
		private String data;

		public Boolean hasData() {
			// Valid: uses instance field in null check
			return data != null;
		}

		// Instance field in ternary
		private Integer limit;

		public Integer getLimitOrDefault(Integer defaultLimit) {
			// Valid: uses instance field in ternary
			return limit != null ? limit : defaultLimit;
		}

		// Instance field in switch
		private String status;

		public Integer getStatusCode() {
			// Valid: uses instance field in switch
			switch on status {
				when 'active' {
					return 200;
				}
				when else {
					return 500;
				}
			}
		}

		// Instance field in try-catch
		private String errorMessage;

		public void handleError() {
			// Valid: uses instance field in try-catch
			try {
				if (errorMessage != null) {
					System.debug(errorMessage);
				}
			} catch (Exception e) {
				errorMessage = e.getMessage();
			}
		}

		// Instance field with method chaining
		private String text;

		public String processText() {
			// Valid: uses instance field in method chain
			return text?.toUpperCase();
		}

		// Instance field in assignment expression
		private Integer counter;

		public void increment() {
			// Valid: uses instance field in assignment
			counter = counter + 1;
		}

		// Instance field with null coalescing
		private String defaultText;

		public String getTextOrDefault(String fallback) {
			// Valid: uses instance field with null coalescing
			return defaultText ?? fallback;
		}

		// Mixed property and field access
		public String propertyValue { get; set; }
		private String fieldValue;

		public Boolean hasValues() {
			// Valid: uses both property and field
			return propertyValue != null && fieldValue != null;
		}
	}

	// Nested expression examples as inner class
	public class NestedExpressionExamples {
		// Instance field access in nested expressions
		private Config.Parser parserConfig;
		private Integer baseIndent;
		private String context;
		private List<String> items;

		// Instance field in constructor argument (single line)
		public void method1() {
			Processor p = new Processor(parserConfig);
		}

		// Instance field in constructor argument (multi-line)
		public void method2() {
			Processor p = new Processor(
				parserConfig,
				baseIndent
			);
		}

		// Instance field in constructor argument (deeply nested)
		public void method3() {
			Processor p = new Processor(
				parserConfig,
				baseIndent,
				new Helper(context)
			);
		}

		// Instance field in method call argument
		public void method4() {
			processData(parserConfig);
		}

		// Instance field in method call argument (multi-line)
		public void method5() {
			processData(
				parserConfig,
				baseIndent
			);
		}

		// Instance field in method call with chaining
		public void method6() {
			getProcessor()
				.process(parserConfig);
		}

		// Instance field in return statement with constructor
		public Processor getProcessor() {
			return new Processor(parserConfig);
		}

		// Instance field in conditional with constructor
		public void method7() {
			if (parserConfig != null) {
				Processor p = new Processor(parserConfig);
			}
		}

		// Instance field in loop with constructor
		public void method8() {
			for (String item : items) {
				Processor p = new Processor(parserConfig, item);
			}
		}

		// Instance field in try-catch with constructor
		public void method9() {
			try {
				Processor p = new Processor(parserConfig);
			} catch (Exception e) {
				System.debug(e);
			}
		}

		// Instance field in assignment with constructor
		public void method10() {
			Processor p;
			p = new Processor(parserConfig);
		}

		// Instance field in ternary with constructor
		public Processor method11() {
			return parserConfig != null
				? new Processor(parserConfig)
				: new Processor();
		}

		// Instance field in switch with constructor
		public Processor method12() {
			switch on context {
				when 'test' {
					return new Processor(parserConfig);
				}
				when else {
					return new Processor();
				}
			}
		}

		// Multiple instance fields in constructor
		public void method13() {
			Processor p = new Processor(
				parserConfig,
				baseIndent,
				context
			);
		}

		// Instance field in nested method call
		public void method14() {
			processData(
				transform(parserConfig)
			);
		}

		// Instance field in list/map initialization
		public void method15() {
			List<Processor> processors = new List<Processor>{
				new Processor(parserConfig),
				new Processor(baseIndent)
			};
		}

		// Instance field in map entry
		public void method16() {
			Map<String, Processor> processorMap = new Map<String, Processor>{
				'key' => new Processor(parserConfig)
			};
		}

		// Instance field with null coalescing in constructor
		public void method17() {
			Processor p = new Processor(
				parserConfig ?? new Config.Parser()
			);
		}

		// Instance field with safe navigation in constructor
		public void method18() {
			Processor p = new Processor(
				parserConfig?.getValue()
			);
		}

		// Instance field in complex nested expression
		public void method19() {
			Processor p = new Processor(
				parserConfig,
				new Helper(
					baseIndent,
					context
				)
			);
		}

		// Instance field in builder pattern
		public void method20() {
			Builder b = new Builder()
				.withConfig(parserConfig)
				.withIndent(baseIndent);
		}

		// Instance field in static method call argument
		public void method21() {
			Utils.process(parserConfig);
		}

		// Instance field in instance method call argument
		public void method22() {
			this.processData(parserConfig);
		}

		// Instance field in super method call argument
		public class Child extends NestedExpressionExamples {
			public void method23() {
				super.processData(parserConfig);
			}
		}

		// Instance field in array access with constructor
		public void method24() {
			Processor[] processors = new Processor[]{
				new Processor(parserConfig)
			};
		}

		// Instance field in cast expression with constructor
		public void method25() {
			Processor p = (Processor) new Processor(parserConfig);
		}

		// Instance field in binary expression with constructor
		public void method26() {
			Processor p = new Processor(parserConfig) != null
				? new Processor(parserConfig)
				: null;
		}

		// Instance field in unary expression with constructor
		public void method27() {
			Processor p = new Processor(!parserConfig.isNull() ? parserConfig : null);
		}

		// Instance field in instanceof check with constructor
		public void method28() {
			if (parserConfig instanceof Config.Parser) {
				Processor p = new Processor(parserConfig);
			}
		}

		// Instance field in assignment expression
		public void method29() {
			Processor p = new Processor(parserConfig);
			p.setConfig(parserConfig);
		}

		// Instance field in return with method call
		public Processor method30() {
			return createProcessor(parserConfig);
		}

		private Processor createProcessor(Config.Parser config) {
			return new Processor(config);
		}

		// Instance field in for-each loop
		public void method31() {
			for (String item : items) {
				Processor p = new Processor(parserConfig, item);
			}
		}

		// Instance field in inner class method
		public void method32() {
			InnerProcessor processor = new InnerProcessor();
			processor.process(parserConfig);
		}

		private class InnerProcessor {
			public void process(Config.Parser config) {
				Processor p = new Processor(config);
			}
		}
	}

	// Instance field in multi-line constructor with with sharing modifier (as inner class)
	public with sharing class ServiceWithSharing {
		private Config config;

		public ServiceWithSharing(Config configParam) {
			this.config = configParam;
		}

		public List<String> processData(List<String> items) {
			// Valid: uses instance field in multi-line constructor
			final Processor processor = new Processor(
				config,  // Instance field used as constructor argument
				10
			);
			return processor.process(items);
		}

		public void processItems(List<String> items, Integer count) {
			// Valid: uses instance field in multi-line constructor
			final Helper helper = new Helper(
				config,  // Instance field used as constructor argument
				count
			);
			helper.execute(items);
		}
	}

	// Edge cases: local variables with same name as fields as inner class
	public class LocalVariableEdgeCases {
		private String name;
		private Integer count;
		private Config config;

		// Valid: uses instance field, even though there's a local variable with same name later
		public void method1() {
			Processor p = new Processor(config);  // Uses instance field 'config'
			String config = 'local';  // Local variable shadows field, but field access above is still valid
		}

		// Valid: uses instance field before local variable declaration
		public void method2() {
			Helper h = new Helper(name);  // Uses instance field 'name'
			Integer count = 5;  // Local variable
			String name = 'local';  // Local variable shadows field
		}

		// Valid: uses instance field in nested scope
		public void method3() {
			if (true) {
				Processor p = new Processor(config);  // Uses instance field 'config'
			}
			String config = 'local';  // Local variable in outer scope
		}

		// Valid: uses instance field in loop
		public void method4() {
			for (Integer i = 0; i < 10; i++) {
				Helper h = new Helper(config);  // Uses instance field 'config'
			}
			String config = 'local';  // Local variable after loop
		}

		// Valid: uses instance field in try-catch
		public void method5() {
			try {
				Processor p = new Processor(config);  // Uses instance field 'config'
			} catch (Exception e) {
				System.debug(e);
			}
			String config = 'local';  // Local variable after try-catch
		}

		// Valid: uses instance field, local variable in different block
		public void method6() {
			{
				Processor p = new Processor(config);  // Uses instance field 'config'
			}
			{
				String config = 'local';  // Local variable in different block
			}
		}

		// Valid: uses instance field with complex type
		public class ComplexTypeExample {
			private Config.Parser parserConfig;
			private List<String> items;
			private Map<String, String> data;

			public void process() {
				// Valid: uses instance field with nested type
				Processor p = new Processor(parserConfig);
				
				// Valid: uses instance field in list initialization
				List<String> result = new List<String>(items);
				
				// Valid: uses instance field in map operations
				String value = data.get('key');
			}
		}

		// Valid: uses instance field with 'with sharing' modifier (inner class)
		public class WithSharingExample {
			private Config config;

			public void process() {
				Processor p = new Processor(config);  // Uses instance field
			}
		}

		// Valid: uses instance field with 'without sharing' modifier (inner class)
		public class WithoutSharingExample {
			private Config config;

			public void process() {
				Processor p = new Processor(config);  // Uses instance field
			}
		}

		// Valid: uses instance field with 'inherited sharing' modifier (inner class)
		public class InheritedSharingExample {
			private Config config;

			public void process() {
				Processor p = new Processor(config);  // Uses instance field
			}
		}

		// Valid: uses instance field in static nested class (instance method)
		public class Outer {
			private Config config;

			public void instanceMethod() {
				Processor p = new Processor(config);  // Uses instance field
			}

			public static class Inner {
				private Config innerConfig;

				public void innerMethod() {
					Processor p = new Processor(innerConfig);  // Uses instance field
				}
			}
		}

		// Valid: uses instance field with generic types
		public class GenericExample {
			private List<String> items;
			private Map<String, Integer> counts;

			public void process() {
				Processor p = new Processor(items);  // Uses instance field
				Helper h = new Helper(counts);  // Uses instance field
			}
		}

		// Valid: uses instance field in method with multiple parameters
		public class MultiParamExample {
			private Config config;

			public void process(String param1, Integer param2, Boolean param3) {
				Processor p = new Processor(
					config,  // Uses instance field
					param1,
					param2
				);
			}
		}

		// Valid: uses instance field in deeply nested expressions
		public class DeepNestingExample {
			private Config config;

			public void process() {
				Processor p = new Processor(
					new Helper(
						config,  // Uses instance field in nested constructor
						10
					)
				);
			}
		}

		// Valid: uses instance field in method chain
		public class MethodChainExample {
			private Config config;

			public void process() {
				getProcessor(config)  // Uses instance field as argument
					.process()
					.finish();
			}

			private Processor getProcessor(Config c) {
				return new Processor(c);
			}
		}
	}
}
