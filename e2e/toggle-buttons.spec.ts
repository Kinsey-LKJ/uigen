import { test, expect } from '@playwright/test';

test.describe('Toggle Buttons', () => {
  test('should toggle between preview and code views', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Find the toggle buttons (Tabs component with Preview and Code tabs)
    const previewTab = page.getByRole('tab', { name: 'Preview' });
    const codeTab = page.getByRole('tab', { name: 'Code' });

    // Verify both tabs exist
    await expect(previewTab).toBeVisible();
    await expect(codeTab).toBeVisible();

    // By default, Preview should be active (selected)
    await expect(previewTab).toHaveAttribute('data-state', 'active');
    await expect(codeTab).toHaveAttribute('data-state', 'inactive');

    // Click on Code tab
    await codeTab.click();

    // Wait a bit for the UI to update
    await page.waitForTimeout(300);

    // Verify Code tab is now active and Preview is inactive
    await expect(codeTab).toHaveAttribute('data-state', 'active');
    await expect(previewTab).toHaveAttribute('data-state', 'inactive');

    // Verify the code view content is visible
    // The code view should show the resizable panel with file tree and editor
    const fileTree = page.locator('[role="tree"]').or(page.getByText('No files yet'));
    await expect(fileTree).toBeVisible();

    // Click back to Preview tab
    await previewTab.click();

    // Wait a bit for the UI to update
    await page.waitForTimeout(300);

    // Verify Preview tab is active again
    await expect(previewTab).toHaveAttribute('data-state', 'active');
    await expect(codeTab).toHaveAttribute('data-state', 'inactive');

    // Verify the preview iframe is visible
    const previewIframe = page.locator('iframe[title="Preview"]');
    await expect(previewIframe).toBeVisible();
  });

  test('should maintain toggle state when switching views', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const previewTab = page.getByRole('tab', { name: 'Preview' });
    const codeTab = page.getByRole('tab', { name: 'Code' });

    // Switch to code view
    await codeTab.click();
    await page.waitForTimeout(300);
    await expect(codeTab).toHaveAttribute('data-state', 'active');

    // Switch back to preview
    await previewTab.click();
    await page.waitForTimeout(300);
    await expect(previewTab).toHaveAttribute('data-state', 'active');

    // Switch to code again
    await codeTab.click();
    await page.waitForTimeout(300);
    await expect(codeTab).toHaveAttribute('data-state', 'active');
  });

  test('should display correct content for each view', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const previewTab = page.getByRole('tab', { name: 'Preview' });
    const codeTab = page.getByRole('tab', { name: 'Code' });

    // Check preview view content
    await expect(previewTab).toHaveAttribute('data-state', 'active');
    const previewIframe = page.locator('iframe[title="Preview"]');
    await expect(previewIframe).toBeVisible();

    // Check code view content
    await codeTab.click();
    await page.waitForTimeout(300);

    // Should show either file tree or "No files yet" message
    const hasFiles = await page.locator('[role="tree"]').isVisible().catch(() => false);
    const noFilesMessage = await page.getByText('No files yet').isVisible().catch(() => false);

    // At least one should be visible
    expect(hasFiles || noFilesMessage).toBeTruthy();
  });
});
