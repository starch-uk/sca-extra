# Jest 30.0 Quick Reference for AI Agents

Concise guide to Jest 30.0 APIs and features for AI coding assistants.

## Globals

Jest provides global functions (no imports needed in JS, but required in TS):

- **`test(name, fn, timeout)`** / **`it(name, fn, timeout)`** - Define a test
- **`describe(name, fn)`** - Group related tests
- **`beforeAll(fn, timeout)`** - Run once before all tests
- **`afterAll(fn, timeout)`** - Run once after all tests
- **`beforeEach(fn, timeout)`** - Run before each test
- **`afterEach(fn, timeout)`** - Run after each test

**TypeScript imports:**

```typescript
import { describe, expect, test } from '@jest/globals';
```

**Modifiers:**

- **`.only`** - Run only this test/describe (e.g., `test.only`, `describe.only`)
- **`.skip`** - Skip this test/describe (e.g., `test.skip`, `describe.skip`)
- **`.todo(name)`** - Mark test as TODO (no implementation)

**`.each`** - Parameterized tests:

```javascript
test.each([
    [1, 2, 3],
    [2, 3, 5],
])('adds %i + %i = %i', (a, b, expected) => {
    expect(a + b).toBe(expected);
});
```

## Expect API

**Basic matchers:**

- **`.toBe(value)`** - Strict equality (`===`)
- **`.toEqual(value)`** - Deep equality
- **`.toBeNull()`** - Matches `null`
- **`.toBeUndefined()`** - Matches `undefined`
- **`.toBeDefined()`** - Opposite of `toBeUndefined()`
- **`.toBeTruthy()`** - Truthy value
- **`.toBeFalsy()`** - Falsy value

**Number matchers:**

- **`.toBeGreaterThan(n)`** - `> n`
- **`.toBeGreaterThanOrEqual(n)`** - `>= n`
- **`.toBeLessThan(n)`** - `< n`
- **`.toBeLessThanOrEqual(n)`** - `<= n`
- **`.toBeCloseTo(n, numDigits?)`** - Floating point equality

**String matchers:**

- **`.toMatch(regexp | string)`** - String matches pattern
- **`.toContain(substring)`** - String contains substring

**Array/Object matchers:**

- **`.toContain(item)`** - Array contains item
- **`.toContainEqual(item)`** - Array contains equal item
- **`.toHaveLength(n)`** - Array/string length
- **`.toHaveProperty(keyPath, value?)`** - Object has property

**Exception matchers:**

- **`.toThrow(error?)`** - Function throws error
- **`.toThrowError(error?)`** - Alias for `toThrow`

**Promise matchers:**

- **`.resolves`** - Awaits promise resolution
- **`.rejects`** - Awaits promise rejection

```javascript
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

**Mock matchers:**

- **`.toHaveBeenCalled()`** - Mock was called
- **`.toHaveBeenCalledTimes(n)`** - Called n times
- **`.toHaveBeenCalledWith(...args)`** - Called with args
- **`.toHaveBeenLastCalledWith(...args)`** - Last call args
- **`.toHaveBeenNthCalledWith(n, ...args)`** - Nth call args
- **`.toHaveReturned()`** - Mock returned (didn't throw)
- **`.toHaveReturnedWith(value)`** - Returned value
- **`.toHaveReturnedTimes(n)`** - Returned n times
- **`.toHaveLastReturnedWith(value)`** - Last return value
- **`.toHaveNthReturnedWith(n, value)`** - Nth return value

**Modifiers:**

- **`.not`** - Negate matcher: `expect(value).not.toBe(null)`
- **`.resolves`** - Unwrap promise: `await expect(promise).resolves.toBe(value)`
- **`.rejects`** - Unwrap rejection: `await expect(promise).rejects.toThrow()`

## Mock Functions

**Creating mocks:**

- **`jest.fn(implementation?)`** - Create mock function
- **`jest.spyOn(object, methodName)`** - Spy on object method
- **`jest.spyOn(object, methodName, accessType?)`** - Spy on getter/setter
  (`'get'` or `'set'`)

**Mock properties:**

- **`.mock.calls`** - Array of call arguments: `[[arg1, arg2], [arg3]]`
- **`.mock.results`** - Array of return values:
  `[{type: 'return', value: x}, ...]`
- **`.mock.instances`** - Instances created with `new`
- **`.mock.contexts`** - `this` contexts for each call
- **`.mock.invocationCallOrder`** - Order of mock calls

**Mock implementations:**

- **`.mockImplementation(fn)`** - Set implementation
- **`.mockImplementationOnce(fn)`** - One-time implementation
- **`.mockReturnValue(value)`** - Return value
- **`.mockReturnValueOnce(value)`** - One-time return
- **`.mockResolvedValue(value)`** - Resolved promise
- **`.mockResolvedValueOnce(value)`** - One-time resolved
- **`.mockRejectedValue(value)`** - Rejected promise
- **`.mockRejectedValueOnce(value)`** - One-time rejected
- **`.mockReset()`** - Clear calls/instances (keeps implementation)
- **`.mockRestore()`** - Restore original (spies only)
- **`.mockClear()`** - Clear calls/instances/results

## Jest Object

**Module mocking:**

- **`jest.mock(moduleName, factory?, options?)`** - Mock module
- **`jest.unmock(moduleName)`** - Unmock module
- **`jest.doMock(moduleName, factory?, options?)`** - Mock (hoisted)
- **`jest.dontMock(moduleName)`** - Don't mock
- **`jest.requireActual(moduleName)`** - Get actual module
- **`jest.requireMock(moduleName)`** - Get mocked module

**Mock management:**

- **`jest.clearAllMocks()`** - Clear all mocks (calls/instances)
- **`jest.resetAllMocks()`** - Reset all mocks (calls/instances/implementations)
- **`jest.restoreAllMocks()`** - Restore all spies

**Timers:**

- **`jest.useFakeTimers()`** - Use fake timers
- **`jest.useRealTimers()`** - Use real timers
- **`jest.advanceTimersByTime(ms)`** - Advance timers
- **`jest.runOnlyPendingTimers()`** - Run pending timers
- **`jest.runAllTimers()`** - Run all timers
- **`jest.runAllImmediates()`** - Run all immediates
- **`jest.advanceTimersToNextTimer()`** - Advance to next timer
- **`jest.clearAllTimers()`** - Clear all timers
- **`jest.getTimerCount()`** - Get timer count
- **`jest.setSystemTime(now)`** - Set system time
- **`jest.getRealSystemTime()`** - Get real system time

**Other:**

- **`jest.setTimeout(timeout)`** - Set test timeout
- **`jest.retryTimes(numRetries, options?)`** - Retry failed tests

## Configuration

**Config file:** `jest.config.js` or `jest` key in `package.json`

**Common options:**

- **`testEnvironment`** - `'node'` | `'jsdom'` | `'jest-environment-node'`
- **`testMatch`** - Array of glob patterns: `['**/__tests__/**/*.js']`
- **`testPathIgnorePatterns`** - Array of regex patterns to ignore
- **`collectCoverage`** - Collect coverage (or `--coverage` CLI)
- **`coverageDirectory`** - Coverage output directory
- **`coverageReporters`** - `['text', 'lcov', 'html']`
- **`collectCoverageFrom`** - Array of glob patterns
- **`verbose`** - Show individual test results
- **`bail`** - Stop after first failure (or number)
- **`testTimeout`** - Default timeout (ms)
- **`roots`** - Array of root directories
- **`moduleNameMapper`** - Map module paths: `{'^@/(.*)$': '<rootDir>/src/$1'}`
- **`transform`** - Transform config: `{'^.+\\.js$': 'babel-jest'}`
- **`transformIgnorePatterns`** - Patterns to skip transformation
- **`setupFilesAfterEnv`** - Array of setup files
- **`testEnvironmentOptions`** - Options for test environment

**Example:**

```javascript
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: ['src/**/*.js'],
    coverageDirectory: 'coverage',
    verbose: true,
    testTimeout: 10000,
};
```

## CLI Options

**Common flags:**

- **`--watch`** / **`-w`** - Watch mode
- **`--coverage`** - Collect coverage
- **`--runInBand`** / **`-i`** - Run serially (no workers)
- **`--testNamePattern=<pattern>`** / **`-t`** - Run matching tests
- **`--testPathPattern=<pattern>`** - Run matching paths
- **`--verbose`** - Show individual test results
- **`--silent`** - Suppress console output
- **`--bail`** - Stop after first failure
- **`--maxWorkers=<num>`** - Number of workers
- **`--detectOpenHandles`** - Detect open handles
- **`--forceExit`** - Force exit after tests
- **`--config=<path>`** - Config file path
- **`--updateSnapshot`** / **`-u`** - Update snapshots
- **`--clearCache`** - Clear cache

**Examples:**

```bash
jest --watch
jest --coverage
jest --testNamePattern="should detect"
jest --testPathPattern="code-style"
```

## Environment Variables

- **`NODE_ENV`** - Usually set to `'test'`
- **`CI`** - Set in CI environments
- **`JEST_WORKER_ID`** - Worker process ID
- **`TZ`** - Timezone (affects date tests)

## Code Transformation

**Transformers:**

- **`babel-jest`** - Babel transformation
- **`ts-jest`** - TypeScript transformation
- **Custom transformer** - Function or module path

**Configuration:**

```javascript
module.exports = {
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.ts$': 'ts-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!(module-to-transform)/)'],
};
```

**Transformer function:**

```javascript
module.exports = {
    transform: {
        '^.+\\.custom$': (src, filename, config, options) => {
            return transformedCode;
        },
    },
};
```

## Best Practices

1. **Use `describe` blocks** to organize related tests
2. **Use descriptive test names** that explain what is being tested
3. **One assertion per test** (when possible) for clarity
4. **Use `beforeEach`/`afterEach`** for test isolation
5. **Mock external dependencies** with `jest.fn()` or `jest.spyOn()`
6. **Use `async`/`await`** for async tests
7. **Clean up mocks** with `jest.clearAllMocks()` in `afterEach`
8. **Use `test.each`** for parameterized tests
9. **Set appropriate timeouts** for slow tests
10. **Use `--watch`** during development

## Common Patterns

**Async test:**

```javascript
test('async operation', async () => {
    const result = await asyncFunction();
    expect(result).toBe(expected);
});
```

**Mocking modules:**

```javascript
jest.mock('./module', () => ({
    functionName: jest.fn(),
}));
```

**Spying on methods:**

```javascript
const spy = jest.spyOn(object, 'method');
// ... test code ...
spy.mockRestore();
```

**Testing errors:**

```javascript
expect(() => {
    throwError();
}).toThrow('Error message');
```

**Testing promises:**

```javascript
await expect(asyncFunction()).resolves.toBe(value);
await expect(asyncFunction()).rejects.toThrow();
```

## Troubleshooting

### Node.js 25 `--localstorage-file` Warning

**Issue:** When running Jest tests with Node.js 25+, you may see the following
warning:

```
(node:xxxxx) Warning: `--localstorage-file` was provided without a valid path
```

**Root Cause:** Jest's Node environment (`jest-environment-node`) accesses
Node.js's webstorage API during test teardown. Node.js 25 requires the
`--localstorage-file` flag to have a valid path when webstorage is accessed.

**Solution:** Provide a valid path for the `--localstorage-file` flag by setting
`NODE_OPTIONS` in your test scripts:

```json
{
    "scripts": {
        "test": "NODE_OPTIONS='--localstorage-file=.jest-localstorage' jest",
        "test:watch": "NODE_OPTIONS='--localstorage-file=.jest-localstorage' jest --watch",
        "test:coverage": "NODE_OPTIONS='--localstorage-file=.jest-localstorage' jest --coverage"
    }
}
```

**Additional Steps:**

1. Add `.jest-localstorage` to your `.gitignore` file to prevent committing the
   temporary file:

    ```
    .jest-localstorage
    ```

2. The file will be automatically created by Node.js when Jest accesses the
   webstorage API.

**Stack Trace Location:** The warning originates from:

- `node:internal/webstorage:32:25` - Node.js webstorage module
- `jest-util/build/index.js:417:59` - `deleteProperties` function
- `jest-environment-node/build/index.js:265:40` - `GlobalProxy.clear` method
- `jest-environment-node/build/index.js:213:23` - `NodeEnvironment.teardown`
  method

**Verification:** To trace the warning source, use:

```bash
NODE_OPTIONS='--trace-warnings' pnpm test
```

This will show the full stack trace indicating where the warning originates.
