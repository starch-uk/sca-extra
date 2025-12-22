# PMD Apex AST Quick Reference for AI Agents

## Core Structure Nodes

**UserClass** - Class declaration

- `@Name`, `@SimpleName` - Class name
- `@Abstract`, `@Interface` - Type flags
- `@Nested` - Inner class flag

**ApexFile** - File/compilation unit (root)

**Method** - Method declaration

- `@Image`, `@MethodName`, `@FullMethodName` - Method name
- `@ReturnType` - Return type
- `@Constructor` - Constructor flag
- `@InputParametersSize` - Parameter count
- Children: `ModifierNode`, `Parameter`, `BlockStatement`

**Field** / **FieldDeclaration** / **FieldDeclarationStatements** - Field declarations

- `@Name` - Field name
- Children: `ModifierNode`, `VariableExpression`

**Property** - Property declaration (getter/setter)

**Parameter** - Method/constructor parameter

- `@Image` - Parameter name
- `@Type` - Parameter type

**ModifierNode** - Access/type modifiers

- `@Static`, `@Final`, `@Abstract`, `@Public`, `@Private`, `@Protected`
- `@Override`, `@Global`, `@WebService`

**Annotation** - Annotation

- `@Name` - Annotation name (e.g., `'SuppressWarnings'`, `'IsTest'`)
- Note: Path is `Field/ModifierNode/Annotation[@Name]` (not `Field/Annotation[@Name]`)

## Control Flow Nodes

**IfBlockStatement** - if statement

- Children: `StandardCondition`, `BlockStatement`

**IfElseBlockStatement** - if-else chain

- Children: multiple `IfBlockStatement`

**SwitchStatement** - switch statement

- Children: `StandardCondition`, case blocks

**WhileLoopStatement** - while loop

- Children: `StandardCondition`, `BlockStatement`

**ForLoopStatement** - for loop

- Children: `StandardCondition`, `BlockStatement`

**ForEachStatement** - for-each loop

- Children: `StandardCondition`, `BlockStatement`

**DoLoopStatement** - do-while loop

**CatchBlockStatement** - catch block

**StandardCondition** - Condition expression (if, while, etc.)

- Children: `BooleanExpression`, `PrimaryExpression`

## Expression Nodes

**PrimaryExpression** - Primary expression (method calls, field access, etc.)

- Children: `MethodCallExpression`, `ReferenceExpression`, `VariableExpression`, etc.

**MethodCallExpression** - Method invocation

- `@Image` - Method name
- Children: arguments

**ReferenceExpression** - Field/method reference

- `@Image` - Reference name

**VariableExpression** - Variable reference

- `@Image` - Variable name

**ThisVariableExpression** - `this` reference

**AssignmentExpression** - Assignment

- `@Op` - Operator (`=`, `+=`, `-=`, `*=`, `/=`, `%=`)

**BinaryExpression** - Binary operation

- `@Op` - Operator (`+`, `-`, `*`, `/`, `==`, `!=`, `<`, `<=`, `>`, `>=`, `and`, `or`, etc.)

**UnaryExpression** - Unary operation

- `@Op` - Operator (`++`, `--`, `+`, `-`, `!`, `not`)

**TernaryExpression** - Ternary operator (`? :`)

- Children: `StandardCondition`, then/else expressions

**BooleanExpression** - Boolean expression

- `@Op` - Operator (`==`, `!=`, `<`, `>`, `and`, `or`, etc.)
- Children: `VariableExpression`, `LiteralExpression`, etc.

**LiteralExpression** - Literal value

- `@Image` - Literal text
- `@Null` - Null literal flag
- `@String` - String literal flag
- `@LiteralType` - Type (e.g., `'Integer'`, `'String'`, `'Boolean'`)

**InstanceOfExpression** - `instanceof` check

**NewListLiteralExpression** - List literal `new List<Type>{...}`

- Children: elements

**NewMapLiteralExpression** - Map literal `new Map<K,V>{...}`

- Children: `MapEntryNode`

**MapEntryNode** - Map entry (key-value pair)

- `@BeginLine`, `@EndLine` - Line numbers

## Statement Nodes

**BlockStatement** - Code block `{...}`

- `@BeginLine`, `@EndLine` - Line numbers

**ReturnStatement** - return statement

- Children: expression

**ThrowStatement** - throw statement

- Children: exception expression

**BreakStatement** - break statement

**ContinueStatement** - continue statement

## Other Nodes

**FormalComment** - Javadoc/comment

**UserEnum** - Enum declaration

- Children: `Field` (enum values)

**VariableDeclaration** - Variable declaration

- `@Image` - Variable name
- Children: `VariableExpression`, `VariableInitializer`

**VariableDeclarationStatements** - Variable declaration statement

- Children: `VariableDeclaration`, `ModifierNode`

**VariableInitializer** - Variable initialization

- Children: `Expression`

**Expression** - Generic expression wrapper

## Common Attributes

**Identity/Name:**

- `@Image` - Text/image (name, value, operator symbol)
- `@Name`, `@SimpleName` - Node name
- `@MethodName`, `@FullMethodName` - Method names
- `@VariableName` - Variable name

**Location:**

- `@BeginLine`, `@EndLine` - Line numbers
- `@BeginColumn`, `@EndColumn` - Column numbers
- `@CurlyBrace` - Has curly braces

**Type/Flags:**

- `@Type`, `@ReturnType`, `@LiteralType` - Types
- `@Static`, `@Final`, `@Abstract`, `@Public`, `@Private`, `@Protected` - Modifiers
- `@Constructor`, `@Interface`, `@Nested` - Structure flags
- `@Override`, `@Null`, `@String` - Special flags

**Operators:**

- `@Op` - Operator symbol (`+`, `-`, `==`, `!=`, `++`, `--`, `+=`, etc.)

**Counts:**

- `@InputParametersSize` - Parameter count

## Common Patterns

### Find methods

```xpath
//Method[@Image = 'methodName']
//Method[@Static = true()]
//Method[@Constructor = true()]
```

### Find classes

```xpath
//UserClass[@Nested = true()]
//UserClass[@Abstract = true()]
```

### Find variables

```xpath
//VariableDeclaration[ancestor::Method]  # Local vars only
//VariableExpression[@Image = 'varName']
```

### Find method calls

```xpath
//MethodCallExpression[@Image = 'methodName']
//PrimaryExpression/MethodCallExpression
```

### Check modifiers

```xpath
//Method[ModifierNode[@Static = true()]]
//Field[ModifierNode[@Final = true()]]
```

### Check annotations

```xpath
//Annotation[@Name = 'SuppressWarnings']
//Method/ModifierNode/Annotation[@Name = 'IsTest']
```

### Find control flow

```xpath
//IfBlockStatement[StandardCondition//MethodCallExpression]
//WhileLoopStatement[StandardCondition//VariableExpression]
```

### Check operators

```xpath
//BinaryExpression[@Op = '==']
//UnaryExpression[@Op = '++']
//AssignmentExpression[@Op = '+=']
```

### Check expressions

```xpath
//LiteralExpression[@Null = true()]
//BooleanExpression[@Op = 'and']
//TernaryExpression
```

### Line number checks

```xpath
//Method[@BeginLine = @EndLine]  # Single line
//BlockStatement[@BeginLine != @EndLine]  # Multi-line
```

### Count checks

```xpath
//Method[count(Parameter) > 2]
//IfElseBlockStatement[count(IfBlockStatement) >= 3]
```

## Important Notes

- **Annotations:** Use `Field/ModifierNode/Annotation[@Name]` path (ModifierNode is required)
- **Local vars:** Use `VariableDeclaration[ancestor::Method]` to exclude class fields
- **Nested expressions:** Use `//` or `.//` to find nested nodes
- **Context:** Use `ancestor::`, `descendant::`, `parent::`, `child::` axes for navigation
- **Predicates:** Use `[condition]` to filter nodes
