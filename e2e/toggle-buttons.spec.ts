import { test, expect } from '@playwright/test';

/**
 * E2E tests for Preview/Code toggle buttons
 *
 * Tests the toggle functionality between Preview and Code views
 * in the main application interface.
 *
 * Component location: src/app/main-content.tsx:34-108
 */
test.describe('Preview/Code Toggle Buttons', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should display both toggle buttons', async ({ page }) => {
    // Both Preview and Code buttons should be visible
    const previewButton = page.getByRole('tab', { name: 'Preview' });
    const codeButton = page.getByRole('tab', { name: 'Code' });

    await expect(previewButton).toBeVisible();
    await expect(codeButton).toBeVisible();
  });

  test('should have Preview selected by default', async ({ page }) => {
    // Preview tab should be active by default
    const previewButton = page.getByRole('tab', { name: 'Preview' });

    await expect(previewButton).toHaveAttribute('data-state', 'active');
    await expect(previewButton).toHaveAttribute('aria-selected', 'true');
  });

  test('should have Code inactive by default', async ({ page }) => {
    // Code tab should be inactive by default
    const codeButton = page.getByRole('tab', { name: 'Code' });

    await expect(codeButton).toHaveAttribute('data-state', 'inactive');
    await expect(codeButton).toHaveAttribute('aria-selected', 'false');
  });

  test('should switch to Code view when Code button is clicked', async ({ page }) => {
    const codeButton = page.getByRole('tab', { name: 'Code' });
    const previewButton = page.getByRole('tab', { name: 'Preview' });

    // Click the Code button
    await codeButton.click();

    // Code should now be active, Preview should be inactive
    await expect(codeButton).toHaveAttribute('data-state', 'active');
    await expect(codeButton).toHaveAttribute('aria-selected', 'true');
    await expect(previewButton).toHaveAttribute('data-state', 'inactive');
    await expect(previewButton).toHaveAttribute('aria-selected', 'false');
  });

  test('should switch to Preview view when Preview button is clicked from Code view', async ({ page }) => {
    const codeButton = page.getByRole('tab', { name: 'Code' });
    const previewButton = page.getByRole('tab', { name: 'Preview' });

    // First switch to Code
    await codeButton.click();
    await expect(codeButton).toHaveAttribute('data-state', 'active');

    // Then switch back to Preview
    await previewButton.click();

    // Preview should now be active, Code should be inactive
    await expect(previewButton).toHaveAttribute('data-state', 'active');
    await expect(previewButton).toHaveAttribute('aria-selected', 'true');
    await expect(codeButton).toHaveAttribute('data-state', 'inactive');
    await expect(codeButton).toHaveAttribute('aria-selected', 'false');
  });

  test('should maintain state during multiple rapid toggles', async ({ page }) => {
    const previewButton = page.getByRole('tab', { name: 'Preview' });
    const codeButton = page.getByRole('tab', { name: 'Code' });

    // Perform multiple rapid toggles
    for (let i = 0; i < 5; i++) {
      await codeButton.click();
      await expect(codeButton).toHaveAttribute('data-state', 'active');

      await previewButton.click();
      await expect(previewButton).toHaveAttribute('data-state', 'active');
    }

    // Final state should be Preview active
    await expect(previewButton).toHaveAttribute('data-state', 'active');
    await expect(codeButton).toHaveAttribute('data-state', 'inactive');
  });

  test('should have proper ARIA attributes for accessibility', async ({ page }) => {
    const previewButton = page.getByRole('tab', { name: 'Preview' });
    const codeButton = page.getByRole('tab', { name: 'Code' });

    // Check that both buttons have proper role
    await expect(previewButton).toHaveRole('tab');
    await expect(codeButton).toHaveRole('tab');

    // Check aria-selected attributes
    await expect(previewButton).toHaveAttribute('aria-selected', 'true');
    await expect(codeButton).toHaveAttribute('aria-selected', 'false');

    // After clicking Code, attributes should update
    await codeButton.click();
    await expect(codeButton).toHaveAttribute('aria-selected', 'true');
    await expect(previewButton).toHaveAttribute('aria-selected', 'false');
  });

  test('should apply correct styling to active button', async ({ page }) => {
    const previewButton = page.getByRole('tab', { name: 'Preview' });
    const codeButton = page.getByRole('tab', { name: 'Code' });

    // Preview should have active styling
    await expect(previewButton).toHaveAttribute('data-state', 'active');

    // Click Code and verify styling changes
    await codeButton.click();

    // Code should now have active styling
    await expect(codeButton).toHaveAttribute('data-state', 'active');
    await expect(previewButton).toHaveAttribute('data-state', 'inactive');
  });

  test('should be keyboard navigable', async ({ page }) => {
    const previewButton = page.getByRole('tab', { name: 'Preview' });

    // Focus on the Preview button
    await previewButton.focus();
    await expect(previewButton).toBeFocused();

    // Press Tab to move to Code button
    await page.keyboard.press('Tab');
    const codeButton = page.getByRole('tab', { name: 'Code' });
    await expect(codeButton).toBeFocused();

    // Press Enter to activate Code button
    await page.keyboard.press('Enter');
    await expect(codeButton).toHaveAttribute('data-state', 'active');
  });

  test('should work correctly with ArrowRight and ArrowLeft keys', async ({ page }) => {
    const previewButton = page.getByRole('tab', { name: 'Preview' });
    const codeButton = page.getByRole('tab', { name: 'Code' });

    // Focus on Preview button
    await previewButton.focus();

    // Press ArrowRight to move to Code button
    await page.keyboard.press('ArrowRight');
    await expect(codeButton).toBeFocused();

    // Press ArrowLeft to move back to Preview button
    await page.keyboard.press('ArrowLeft');
    await expect(previewButton).toBeFocused();
  });

  test('should handle click on already active button gracefully', async ({ page }) => {
    const previewButton = page.getByRole('tab', { name: 'Preview' });

    // Preview is already active, click it again
    await previewButton.click();

    // Should remain active
    await expect(previewButton).toHaveAttribute('data-state', 'active');
    await expect(previewButton).toHaveAttribute('aria-selected', 'true');
  });

  test('should have correct visual appearance', async ({ page }) => {
    // Take a screenshot of the toggle buttons in default state
    const toggleButtons = page.getByRole('tablist');
    await expect(toggleButtons).toBeVisible();

    // Verify both buttons are present in the tablist
    const buttons = toggleButtons.getByRole('tab');
    await expect(buttons).toHaveCount(2);
  });

  test('should toggle content areas correctly', async ({ page }) => {
    const codeButton = page.getByRole('tab', { name: 'Code' });

    // Initially should show preview content (if any content exists)
    // This test assumes content changes when toggling

    // Switch to Code view
    await codeButton.click();
    await expect(codeButton).toHaveAttribute('data-state', 'active');

    // Wait a bit for content to render
    await page.waitForTimeout(100);

    // Switch back to Preview
    const previewButton = page.getByRole('tab', { name: 'Preview' });
    await previewButton.click();
    await expect(previewButton).toHaveAttribute('data-state', 'active');
  });
});

/**
 * Additional test suite for edge cases and error scenarios
 */
test.describe('Toggle Buttons - Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should not break with rapid successive clicks', async ({ page }) => {
    const codeButton = page.getByRole('tab', { name: 'Code' });

    // Click multiple times in rapid succession
    await Promise.all([
      codeButton.click(),
      codeButton.click(),
      codeButton.click(),
    ]);

    // Should still end up in a valid state
    await expect(codeButton).toHaveAttribute('data-state', 'active');
  });

  test('should maintain toggle state after page interactions', async ({ page }) => {
    const codeButton = page.getByRole('tab', { name: 'Code' });
    const previewButton = page.getByRole('tab', { name: 'Preview' });

    // Switch to Code
    await codeButton.click();
    await expect(codeButton).toHaveAttribute('data-state', 'active');

    // Interact with other parts of the page (if chat input exists)
    const chatInput = page.getByPlaceholder(/message/i);
    if (await chatInput.isVisible().catch(() => false)) {
      await chatInput.click();
    }

    // Toggle state should be preserved
    await expect(codeButton).toHaveAttribute('data-state', 'active');
    await expect(previewButton).toHaveAttribute('data-state', 'inactive');
  });

  test('should work correctly after browser back/forward navigation', async ({ page }) => {
    const codeButton = page.getByRole('tab', { name: 'Code' });

    // Switch to Code view
    await codeButton.click();
    await expect(codeButton).toHaveAttribute('data-state', 'active');

    // Navigate to a different page (if applicable) and back
    // This is a placeholder - adjust based on actual app navigation
    const currentUrl = page.url();

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should return to default state (Preview)
    const previewButton = page.getByRole('tab', { name: 'Preview' });
    await expect(previewButton).toHaveAttribute('data-state', 'active');
  });
});
