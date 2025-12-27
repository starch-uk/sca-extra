# ApexDoc Quick Reference for AI Agents

## Overview

ApexDoc is Salesforce's standardized documentation format for Apex code. Uses Javadoc-style comments (`/** ... */`) placed immediately before class, method, property, or enum declarations.

## Basic Syntax

```apex
/**
 * Description text (first line is summary)
 * 
 * Additional description paragraphs.
 * 
 * @tagName tag content
 */
```

## Common Tags

### Class/Interface Documentation

- `@description` - Class purpose and overview
- `@author` - Author name
- `@date` - Creation/modification date
- `@group` - Group/namespace for organization
- `@see` - Reference to related classes/methods

### Method Documentation

- `@description` - Method purpose and behavior
- `@param parameterName Description` - Parameter documentation (one per parameter)
- `@return Description` - Return value description
- `@throws ExceptionType Description` - Exception documentation (one per exception)
- `@example` - Usage example (code block)
- `@see` - Reference to related methods/classes

### Property/Field Documentation

- `@description` - Property purpose and usage
- `@see` - Reference to related properties/methods

## Tag Syntax

### @param

```apex
/**
 * @param input The string to reverse
 * @param caseSensitive Whether comparison is case-sensitive
 */
```

### @return

```apex
/**
 * @return The reversed string, or null if input is null
 */
```

### @throws

```apex
/**
 * @throws IllegalArgumentException if input is empty
 * @throws NullPointerException if input is null
 */
```

### @example

```apex
/**
 * @example
 * String result = StringUtils.reverse('hello');
 * // result is 'olleh'
 */
```

### @see

```apex
/**
 * @see StringUtils#capitalize(String)
 * @see RelatedClass
 */
```

## Complete Examples

### Class with Methods

```apex
/**
 * @description Utility methods for string manipulation
 * @author John Doe
 * @date 2024-01-15
 */
public class StringUtils {
    
    /**
     * @description Reverses the given string
     * @param input The string to reverse
     * @return The reversed string, or null if input is null
     * @example
     * String reversed = StringUtils.reverse('hello');
     * // reversed is 'olleh'
     */
    public static String reverse(String input) {
        if (input == null) {
            return null;
        }
        return input.reverse();
    }
    
    /**
     * @description Capitalizes the first letter of a string
     * @param input The string to capitalize
     * @return The capitalized string
     * @throws IllegalArgumentException if input is empty
     */
    public static String capitalize(String input) {
        if (String.isBlank(input)) {
            throw new IllegalArgumentException('Input cannot be empty');
        }
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
}
```

### Property Documentation

```apex
/**
 * @description Account name for this record
 */
public String accountName { get; set; }
```

### Enum Documentation

```apex
/**
 * @description Status values for order processing
 */
public enum OrderStatus {
    PENDING,
    PROCESSING,
    COMPLETED,
    CANCELLED
}
```

## Best Practices

- **First line is summary** - Brief one-line description
- **Additional paragraphs** - Detailed explanation if needed
- **Tag order** - `@description`, `@param`, `@return`, `@throws`, `@example`, `@see`
- **Complete documentation** - Document all public classes, methods, and properties
- **Clear descriptions** - Use clear, concise language
- **Examples** - Include `@example` for complex methods
- **Exception documentation** - Document all thrown exceptions with `@throws`

## PMD AST Context

In PMD AST, ApexDoc comments appear as **FormalComment** nodes:

```xpath
//FormalComment[starts-with(@Image, '/**')]
//Method[preceding-sibling::FormalComment]
```

**Note:** PMD typically ignores comments in XPath queries. For ApexDoc validation, use Regex engine or custom Java rules.

## Related Documentation

- **[PMD Quick Reference](PMD.md)** - PMD essentials (PMD typically ignores comments; use Regex for ApexDoc validation)
- **[PMD Apex AST Reference](APEX_PMD_AST.md)** - PMD AST structure (ApexDoc appears as FormalComment nodes)
- **[Salesforce ApexDoc Introduction](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_doc_intro.htm)** - Official ApexDoc overview
- **[ApexDoc Format](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_doc_format.htm)** - Formatting guidelines
- **[ApexDoc Constructs](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_doc_constructs.htm)** - Available tags and constructs
- **[ApexDoc Examples](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_doc_examples.htm)** - Complete examples

