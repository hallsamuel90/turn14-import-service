import dotenv from 'dotenv';
import 'reflect-metadata';
import apiUsersConfig from './apiUsers/config/config';
import brandsConfig from './brands/config/config';
import expressAppConfig from './config/expressApp';
import mongoConfig from './config/mongoose';
import runMaintenanceJobs from './maintenance-jobs/runMaintenanceJobs';
import productMgmtConfig from './productMgmt/config/config';

// load env variables
dotenv.config();

// log ts files instead of js
require('source-map-support').install();

mongoConfig();

apiUsersConfig();

brandsConfig();

productMgmtConfig();

const app = expressAppConfig();
app.listen(process.env.PORT || '8081');

runMaintenanceJobs();
