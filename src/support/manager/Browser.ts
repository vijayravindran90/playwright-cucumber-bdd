import { chromium, firefox, LaunchOptions } from '@playwright/test';

const browserOptions: LaunchOptions = {
  slowMo: 500,
  args: ['--start-maximized', '--disable-extensions', '--disable-plugins'],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
  headless: process.env.HEADLESS === 'true',
  timeout: Number.parseInt(process.env.BROWSER_LAUNCH_TIMEOUT, 10),
  downloadsPath: './test-results/downloads',
};

export const launch = () => {
  const browserType = process.env.BROWSER;
  return browserType === 'chrome'
    ? chromium.launch(browserOptions)
    : firefox.launch(browserOptions);
};
