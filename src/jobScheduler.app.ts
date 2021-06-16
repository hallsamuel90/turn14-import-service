import dotenv from 'dotenv';
import 'reflect-metadata';
import expressAppConfig from './config/expressApp';
import mongoConfig from './config/mongoose';
import jobSchedulerConfig from './productMgmt/config/jobSchedulerConfig';
import { ProductSyncQueue } from './productMgmt/jobQueue/models/productSyncQueue';
import { ProductSyncQueueRepositoryMongo } from './productMgmt/jobQueue/repositories';

// load env variables
dotenv.config();

// log ts files instead of js
require('source-map-support').install();

const queueRepo = new ProductSyncQueueRepositoryMongo();

const appConfig = async (): Promise<void> => {
  await mongoConfig();

  try {
    await queueRepo.fetchQueue();
  } catch (e) {
    console.info('initializing queue...');
    await queueRepo.save(new ProductSyncQueue());
  }

  await jobSchedulerConfig();
};

appConfig();

const app = expressAppConfig();
app.listen(process.env.PORT || '8083');
