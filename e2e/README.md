# E2E Tests

This directory contains End-to-End (E2E) tests for the UIGen application using Playwright.

## Setup

### Install Dependencies

First, install Playwright and its browsers:

```bash
npm install -D @playwright/test
npx playwright install
```

Or install specific browsers:

```bash
npx playwright install chromium  # For Chrome/Edge
npx playwright install firefox   # For Firefox
npx playwright install webkit    # For Safari
```

## Running Tests

### Run all tests

```bash
npx playwright test
```

### Run tests in UI mode (interactive)

```bash
npx playwright test --ui
```

### Run tests in headed mode (see browser)

```bash
npx playwright test --headed
```

### Run specific test file

```bash
npx playwright test e2e/toggle-buttons.spec.ts
```

### Run tests in specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Debug tests

```bash
npx playwright test --debug
```

### View test report

```bash
npx playwright show-report
```

## Test Structure

### `toggle-buttons.spec.ts`

Comprehensive tests for the Preview/Code toggle buttons functionality.

**Test Coverage:**
- ✓ Button visibility and presence
- ✓ Default state (Preview active)
- ✓ Toggle between Preview and Code
- ✓ State persistence during multiple toggles
- ✓ Accessibility (ARIA attributes, keyboard navigation)
- ✓ Visual styling updates
- ✓ Edge cases (rapid clicks, state preservation)

**Key Test Cases:**
1. Display verification - Both buttons visible
2. Default state - Preview active by default
3. Click interactions - Toggle switches view correctly
4. Multiple toggles - State maintained through rapid changes
5. Accessibility - Proper ARIA roles and attributes
6. Keyboard navigation - Tab, Arrow keys, Enter/Space
7. Edge cases - Rapid clicks, page interactions, refresh behavior

## Configuration

The Playwright configuration is in `playwright.config.ts` at the root of the project.

**Key Settings:**
- Test directory: `./e2e`
- Base URL: `http://localhost:3000`
- Browsers: Chromium, Firefox, WebKit
- Auto-start dev server before tests
- Screenshots on failure
- Trace on retry

## Writing New Tests

When adding new E2E tests:

1. Create a new `.spec.ts` file in the `e2e/` directory
2. Import Playwright test utilities:
   ```typescript
   import { test, expect } from '@playwright/test';
   ```
3. Use `test.describe()` to group related tests
4. Use `test.beforeEach()` for common setup
5. Use `test()` for individual test cases
6. Follow the AAA pattern: Arrange, Act, Assert

**Example:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const button = page.getByRole('button', { name: 'Click me' });

    // Act
    await button.click();

    // Assert
    await expect(button).toHaveText('Clicked!');
  });
});
```

## Best Practices

1. **Use semantic locators**: Prefer `getByRole()`, `getByLabel()`, `getByText()` over CSS selectors
2. **Wait for elements**: Use `await expect()` which auto-waits for conditions
3. **Test user behavior**: Focus on what users can see and do, not implementation details
4. **Keep tests independent**: Each test should be able to run in isolation
5. **Use descriptive names**: Test names should clearly describe what they verify
6. **Group related tests**: Use `test.describe()` for logical grouping
7. **Clean up**: Tests should not leave side effects

## Debugging Tips

### Take screenshots
```typescript
await page.screenshot({ path: 'screenshot.png' });
```

### Pause execution
```typescript
await page.pause();
```

### Console logs
```typescript
page.on('console', msg => console.log(msg.text()));
```

### Network requests
```typescript
page.on('request', request => console.log(request.url()));
```

### Enable verbose logging
```bash
DEBUG=pw:api npx playwright test
```

## CI/CD Integration

The tests are configured to run in CI environments with:
- 2 retries on failure
- Single worker (no parallelization)
- HTML reporter for results
- Auto-start dev server

To run in CI:
```bash
CI=true npx playwright test
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Selectors Guide](https://playwright.dev/docs/selectors)

## Troubleshooting

### "Browser not found" error
```bash
npx playwright install
```

### Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Tests timing out
- Increase timeout in `playwright.config.ts`
- Check if dev server is starting correctly
- Verify network conditions

### Flaky tests
- Add explicit waits with `waitForLoadState()`
- Use `waitForTimeout()` sparingly (last resort)
- Check for race conditions in test code
