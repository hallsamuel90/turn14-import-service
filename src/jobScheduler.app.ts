import dotenv from 'dotenv';
import 'reflect-metadata';
import expressAppConfig from './config/expressApp';
import jobSchedulerConfig from './productMgmt/config/jobSchedulerConfig';

// load env variables
dotenv.config();

// log ts files instead of js
require('source-map-support').install();

jobSchedulerConfig();

const app = expressAppConfig();
app.listen(process.env.PORT || '8083');
