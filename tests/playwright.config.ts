import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  reporter: [['./numbered-reporter.ts'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:9002',
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    // Main project for most tests - runs in parallel with multiple workers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/storage-ui.spec.ts'],
    },
    // Storage UI tests use popup-based auth which is sensitive to parallel execution.
    // Run these tests serially after other tests complete.
    {
      name: 'chromium-storage-ui',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/storage-ui.spec.ts',
      dependencies: ['chromium'],
    },
  ],
  // Set workers to 1 for storage-ui project (applied via CLI or here)
  workers: process.env.CI ? 1 : undefined,
  webServer: {
    command: 'npm run dev',
    port: 9002,
    reuseExistingServer: !process.env.CI,
  },
});
