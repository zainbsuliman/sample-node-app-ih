# Test Suite Documentation

This directory contains comprehensive tests for the DevOps Bootcamp Showcase application.

## Test Structure

### Server Tests (`server.test.js`)
Tests the Express.js server functionality including:
- Static file serving
- Health check endpoint
- Route handling
- Error handling
- Middleware functionality
- Security headers

### Client Tests (`client.test.js`)
Tests the client-side JavaScript functionality including:
- DOM manipulation
- Event handling
- Smooth scrolling
- Animation effects
- Interactive features
- Performance considerations

### Integration Tests (`integration.test.js`)
Tests the full application flow including:
- End-to-end functionality
- Asset serving
- Error scenarios
- Performance benchmarks
- Security validation
- Concurrent request handling

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test Suites
```bash
# Server tests only
npx jest --selectProjects server

# Client tests only
npx jest --selectProjects client
```

## Test Coverage

The test suite aims to achieve high coverage across:
- **Server-side code**: Express routes, middleware, error handling
- **Client-side code**: JavaScript functionality, DOM interactions
- **Integration scenarios**: Full application workflows

## Test Environment

- **Server tests**: Node.js environment with Supertest for HTTP testing
- **Client tests**: jsdom environment for DOM simulation
- **Integration tests**: Full application testing with real HTTP requests

## Writing New Tests

When adding new features:

1. **Server functionality**: Add tests to `server.test.js`
2. **Client functionality**: Add tests to `client.test.js`
3. **Full workflows**: Add tests to `integration.test.js`

### Test Naming Convention
- Use descriptive test names
- Group related tests with `describe` blocks
- Use `test` or `it` for individual test cases

### Example Test Structure
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup code
  });

  test('should do something specific', () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- Fast execution time
- No external dependencies
- Comprehensive coverage
- Clear failure reporting

## Debugging Tests

### Verbose Output
```bash
npx jest --verbose
```

### Debug Mode
```bash
npx jest --detectOpenHandles --forceExit
```

### Single Test File
```bash
npx jest tests/server.test.js
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Use `beforeEach`/`afterEach` for setup/teardown
3. **Mocking**: Mock external dependencies appropriately
4. **Assertions**: Use specific, meaningful assertions
5. **Performance**: Keep tests fast and efficient
