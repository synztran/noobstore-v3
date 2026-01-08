# Unit Tests

This directory contains unit tests for the NoobStore Web UI following the development guidelines.

## Test Structure

Tests are organized in `__tests__` folders alongside the code they test:

```
src/
├── context/Auth/__tests__/Auth.test.tsx          # Auth context tests
├── client/__tests__/client.test.ts               # HTTP client tests
└── __tests__/setup.ts                            # Jest setup and global mocks
```

## Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage report
yarn test:coverage

# Run a specific test file
yarn test Auth.test.tsx
```

## Test Coverage

-   **Auth Context** (`src/context/Auth/__tests__/Auth.test.tsx`)

    -   ✅ `isNonEmpty` helper correctly identifies empty vs non-empty objects/arrays
    -   ✅ `isAuthenticated` flag reflects actual auth state
    -   ✅ `withTimeout` prevents indefinite waiting and sets loading state properly
    -   ✅ Context availability and multi-child component support

-   **HTTP Client** (`src/client/__tests__/client.test.ts`)
    -   ✅ AbortController timeout behavior
    -   ✅ GET request caching with promise cleanup
    -   ✅ Error handling and retry logic
    -   ✅ Authorization header injection
    -   ✅ Request timing measurements
    -   ✅ FormData and various HTTP methods

## Key Test Scenarios

### Auth Context Tests

1. **Empty initUser handling**

    - Empty objects `{}` do not set `isAuthenticated` to true
    - Empty arrays `[]` are treated as unauthenticated
    - `null` and `undefined` are handled gracefully

2. **Loading state management**

    - `isLoading` is false when `initUser` is provided
    - `isLoading` is true when awaiting user data
    - `isLoading` is false even after timeout/error

3. **Timeout behavior**
    - Provider does not freeze when API is slow
    - Loading completes within reasonable time
    - UI remains functional even on network failures

### Client Tests

1. **Timeout handling**

    - AbortController properly aborts long-running requests
    - Requests complete within timeout window

2. **Caching**

    - GET requests are cached when flag is true
    - Cached promises are cleared on error
    - Multiple calls reuse cached responses

3. **Error recovery**
    - Requests retry on 5xx errors when configured
    - No retry when count is 0
    - Errors are properly reported

## Development Guidelines

Tests follow the NoobStore Web UI guidelines:

-   ✅ **TypeScript**: Strict typing, no `any` types
-   ✅ **Modern JavaScript**: ES6+ features only
-   ✅ **Naming**: camelCase for functions, clear descriptive names
-   ✅ **Imports**: Absolute paths with `@/` alias
-   ✅ **Mocking**: Proper jest mocks for external dependencies
-   ✅ **Organization**: Tests live next to code in `__tests__` folders

## Dependencies

Tests use:

-   **Jest**: Test runner and assertion library
-   **@testing-library/react**: React component testing utilities
-   **@testing-library/jest-dom**: Custom Jest matchers for DOM
-   **ts-jest**: TypeScript support in Jest

## Coverage Requirements

Currently configured thresholds:

```
branches:  50%
functions: 50%
lines:     50%
statements: 50%
```

To view coverage report:

```bash
yarn test:coverage
```

## Best Practices

1. **Mock external dependencies** - API calls, routing, cookies are mocked
2. **Test behavior, not implementation** - Focus on what users see
3. **Use descriptive test names** - Tests serve as documentation
4. **Keep tests isolated** - Clear mocks between tests
5. **Wait for async operations** - Use `waitFor()` for async state changes

## Example Test

```typescript
it('should set isAuthenticated to true when initUser is provided', async () => {
	const mockUser = { firstName: 'John' };

	const { getByTestId } = render(
		<AuthProvider
			token=""
			redirectUrl=""
			source=""
			initUser={mockUser}
		>
			<TestComponent />
		</AuthProvider>
	);

	await waitFor(() => {
		const isAuthenticated = getByTestId('is-authenticated');
		expect(isAuthenticated.textContent).toBe('Authenticated');
	});
});
```

## Troubleshooting

### "Cannot find module" errors

-   Verify `jest.config.js` has correct `moduleNameMapper` for `@/` alias
-   Ensure all files are in `src/` directory

### "Act" warnings

-   Wrap state updates in `act()` or use `waitFor()`
-   This ensures React is aware of state changes

### Timeout errors

-   Increase `timeout` in `waitFor()` options if needed
-   Check that mocks are properly configured

## Future Improvements

-   [ ] Integration tests for full auth flow
-   [ ] E2E tests with Cypress/Playwright
-   [ ] Performance benchmarks
-   [ ] Visual regression tests
