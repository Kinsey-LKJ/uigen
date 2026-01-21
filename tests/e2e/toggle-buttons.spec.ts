import { test, expect } from '@playwright/test';

test.describe('Toggle Buttons', () => {
  test('should switch between Preview and Code views when clicked', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    console.log('Page loaded successfully');

    // Take screenshot of initial state
    await page.screenshot({ path: 'screenshots/01-initial-preview-view.png', fullPage: true });
    console.log('Screenshot 1: Initial preview view captured');

    // Verify Preview button is active initially
    const previewButton = page.getByRole('tab', { name: 'Preview' });
    const codeButton = page.getByRole('tab', { name: 'Code' });

    await expect(previewButton).toBeVisible();
    await expect(codeButton).toBeVisible();

    const previewState = await previewButton.getAttribute('data-state');
    console.log(`Preview button initial state: ${previewState}`);
    expect(previewState).toBe('active');

    // Click the Code button
    console.log('Clicking Code button...');
    await codeButton.click();
    await page.waitForTimeout(500); // Wait for transition

    // Take screenshot of code view
    await page.screenshot({ path: 'screenshots/02-code-view.png', fullPage: true });
    console.log('Screenshot 2: Code view captured');

    // Verify Code button is now active
    const codeState = await codeButton.getAttribute('data-state');
    console.log(`Code button state after click: ${codeState}`);
    expect(codeState).toBe('active');

    // Verify Monaco editor is visible (code editor component)
    const monacoEditor = page.locator('.monaco-editor').first();
    await expect(monacoEditor).toBeVisible({ timeout: 5000 });
    console.log('Monaco editor is visible in code view');

    // Click back to Preview button
    console.log('Clicking Preview button...');
    await previewButton.click();
    await page.waitForTimeout(500); // Wait for transition

    // Take screenshot of preview view again
    await page.screenshot({ path: 'screenshots/03-back-to-preview.png', fullPage: true });
    console.log('Screenshot 3: Back to preview view captured');

    // Verify Preview button is active again
    const finalPreviewState = await previewButton.getAttribute('data-state');
    console.log(`Preview button final state: ${finalPreviewState}`);
    expect(finalPreviewState).toBe('active');

    console.log('✅ All toggle button tests passed!');
  });
});
