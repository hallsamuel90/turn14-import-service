import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import logger from 'morgan';
import { join } from 'path';
import { Container } from 'typedi';
import healthRouter from './api/health';
import importRouter from './api/import';
import mongoLoader from './loaders/mongoose';
import ImportSubscriber from './subscribers/importSubscriber';
import RegistrationSubscriber from './subscribers/registrationSubscriber';

// load env variables
dotenv.config();

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use('/', healthRouter);
app.use('/import', importRouter);

// init rabbitmq subscriber(s)
const importSubscriber = Container.get(ImportSubscriber);
importSubscriber.subscribeImportBrandsSequence();
const registrationSubscriber = Container.get(RegistrationSubscriber);
registrationSubscriber.subscribeRegistrationSequence();

mongoLoader();

export default app;
