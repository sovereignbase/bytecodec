import { defineConfig, devices } from '@playwright/test'

const firefoxLaunchOptions = process.env.PLAYWRIGHT_FIREFOX_EXECUTABLE
  ? { executablePath: process.env.PLAYWRIGHT_FIREFOX_EXECUTABLE }
  : undefined

export default defineConfig({
  testDir: 'test/compatibility/runsInBrowsers',
  reporter: [
    ['list'],
    ['json', { outputFile: 'test/.results/playwright.json' }],
  ],
  testMatch: '**/*.spec.ts',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox', launchOptions: firefoxLaunchOptions },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-firefox',
      use: {
        browserName: 'firefox',
        launchOptions: firefoxLaunchOptions,
        viewport: { width: 390, height: 844 },
        hasTouch: true,
      },
    },
    {
      name: 'mobile-webkit',
      use: { ...devices['iPhone 15'] },
    },
  ],
})
