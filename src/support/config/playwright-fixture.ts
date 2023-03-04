import { Page } from 'playwright-core';

type PlaywrightFixture = {
  page: Page;
};

export const fixture: PlaywrightFixture = {
  page: undefined as Page,
};
