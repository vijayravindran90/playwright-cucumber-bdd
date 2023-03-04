import fse from 'fs-extra';
import * as dotenv from "dotenv";
dotenv.config({ path: process.env.TEST_ENV ? `.env.${process.env.TEST_ENV}` : '.env',
override: process.env.TEST_ENV ? true : false, });

fse.ensureDir('./test-results/reports');
fse.remove('./test-results/screenshots');
fse.remove('./test-results/videos');

let options = [
    '--require-module ts-node/register',
    '--require **/steps/*.ts',
    '--require ./src/support/config/hooks.ts',
    '--format summary',
    '--format @cucumber/pretty-formatter',
    '--format rerun:@rerun.txt',
    '--format json:./test-results/reports/cucumber.json',
    '--format html:./test-results/reports/cucumber_report.html',
    '--publish-quiet true',
    `--parallel=${process.env.PARALLEL_THREAD}`,
    '--format-options \'{"snippetInterface":"async-await"}\'',
    `--retry=${process.env.RETRIES}`,
    '--tags "not @ignore"',
].join(' ');

export const runner = [
    './features/',
    options,
].join(' ');

export const rerun = [
    '@rerun.txt',
    options,
].join(' ');

export default{ runner, rerun };
