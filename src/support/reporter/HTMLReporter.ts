import os from 'node:os';
import * as dotenv from "dotenv";
import report from 'multiple-cucumber-html-reporter';
import { dateGenerator } from '../utils/DateUtil';
import EnvUtil from '../utils/EnvUtil';
export const generateReport = () => {
  dotenv.config({ path: './env' });
  EnvUtil.setEnv();
  report.generate({
    jsonDir: './test-results/reports/',
    reportPath: './test-results/reports/',
    pageTitle: 'Test Execution Report',
    reportName: 'Execution Results',
    displayDuration: true,
    displayReportTime: true,
    hideMetadata: false,
    customMetadata: false,
    metadata: {
      browser: {
        name: process.env.BROWSER,
        version: 'latest',
      },
      device: os.hostname(),
      platform: {
        name: os.type(),
        version: os.version(),
      },
    },
    customData: {
      title: 'Run Info',
      data: [
        {
          label: 'Execution Date',
          value: dateGenerator('DD/MM/YYYY', 0, 0, 0),
        },
        { label: 'Base URL', value: process.env.BASE_URL },
        { label: 'Environment', value: process.env.ENVIRONMENT },
      ],
    },
  });
};
generateReport();
