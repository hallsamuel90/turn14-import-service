import dotenv from 'dotenv';
import 'reflect-metadata';
import apiUsersConfig from './apiUsers/config/config';
import brandsConfig from './brands/config/config';
import expressAppConfig from './config/expressApp';
import mongoConfig from './config/mongoose';
import productMgmtConfig from './productMgmt/config/config';

// load env variables
dotenv.config();

mongoConfig();

apiUsersConfig();

brandsConfig();

productMgmtConfig();

const app = expressAppConfig();
app.listen(process.env.PORT || '8081');
