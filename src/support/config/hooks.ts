import fse from 'fs-extra';
import {
  Before,
  BeforeAll,
  AfterAll,
  After,
  setDefaultTimeout,
  ITestCaseHookParameter,
  Status,
} from '@cucumber/cucumber';
import { Browser } from '@playwright/test';
import { launch } from '../manager/Browser';
import { fixture } from './playwright-fixture';

const timeInMin: number = 60 * 1000;
setDefaultTimeout(Number.parseInt(process.env.TEST_TIMEOUT, 10) * timeInMin);
let browser: Browser;
const env = `${process.env.ENVIRONMENT}`;

// launch the browser
BeforeAll(async function () {
  const emptyDownload = fse.existsSync('download')
    ? fse.emptyDir('download')
    : Promise.resolve();
  const emptyTempVideo = fse.existsSync('temp-video')
    ? fse.emptyDir('temp-video')
    : Promise.resolve();
  await Promise.all([emptyDownload, emptyTempVideo]);
  browser = await launch();
});

// close the browser
AfterAll(async function () {
  await browser.close();
});

// Create a new browser context and page per scenario
Before(async function () {
  this.context = await browser.newContext({
    viewport: {
      width: Number.parseInt(process.env.VIEWPORT_WIDTH),
      height: Number.parseInt(process.env.VIEWPORT_HEIGHT),
    },
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    recordVideo:
      process.env.RECORD_VIDEO === 'true'
        ? { dir: './test-results/videos' }
        : undefined,
  });
  fixture.page = await this.context?.newPage();
  await this.context?.tracing.start({ screenshots: true, snapshots: true });

  /// In the case of multiple test environment
  /*const BASE_URLS = {
    production: 'production_url',
    staging: `staging_url`,
    dynamic: `dynamic_url`,
    local: 'local_url',
  };
  process.env.BASE_URL = BASE_URLS[env];*/
  await fixture.page.goto(process.env.BASE_URL);
});

// Cleanup after each scenario
After(async function ({ result, pickle }: ITestCaseHookParameter) {
  const status = result.status;
  const scenario = pickle.name;
  const videoPath = await fixture.page?.video()?.path();
  const traceFileName = `./test-results/traces/${scenario}_traces.zip`;
  if (status === Status.FAILED) {
    const image = await fixture.page?.screenshot({
      path: `./test-results/screenshots/${scenario}.png`,
      fullPage: true,
    });
    await this.attach(image, 'image/png');
  }
  await this.context?.tracing.stop({
    path: traceFileName,
  });
  const traceFileLink = `<a href="https://trace.playwright.dev/?trace=blob&traceFileName=${traceFileName}">Trace File</a>`;
  await this.attach(traceFileLink, 'text/html');
  await fixture.page?.close();
  await this.context?.close();

  if (process.env.RECORD_VIDEO === 'true') {
    if (status === Status.FAILED) {
      fse.renameSync(videoPath, `./test-results/videos/${scenario}.webm`);
      await this.attach(
        fse.readFileSync(`./test-results/videos/${scenario}.webm`),
        'video/webm'
      );
    } else {
      fse.unlinkSync(videoPath);
    }
  }
});
