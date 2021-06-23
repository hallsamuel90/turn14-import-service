import dotenv from 'dotenv';
import 'reflect-metadata';
import expressAppConfig from './config/expressApp';
import { initQueue } from './config/initQueue';
import mongoConfig from './config/mongoose';
import { clearExtraJobs } from './maintenance-jobs/2021-06-21-clear-extra-jobs';
import jobSchedulerConfig from './productMgmt/config/jobSchedulerConfig';

// load env variables
dotenv.config();

// log ts files instead of js
require('source-map-support').install();

const appConfig = async (): Promise<void> => {
  await mongoConfig();

  await initQueue();

  await jobSchedulerConfig();
};

appConfig();

const app = expressAppConfig();
app.listen(process.env.PORT || '8083');
