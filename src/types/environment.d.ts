export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENVIRONMENT: 'production';
      BASE_URL: 'https://demo.playwright.dev/todomvc/';
      BROWSER: 'chrome';
      PARALLEL_THREAD: 4;
      RETRIES: 0;
      HEADLESS: 'true';
      VIEWPORT_WIDTH: '1280';
      VIEWPORT_HEIGHT: '720';
      DYNAMIC_SUBDOMAIN?: string;
    }
  }
}
