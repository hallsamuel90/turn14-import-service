import cookieParser from 'cookie-parser';
import express, { json, static, urlencoded } from 'express';
import logger from 'morgan';
import { join } from 'path';
import { Container } from 'typedi';
import healthRouter from './api/health';
import importRouter from './api/import';
import ImportSubscriber from './subscribers/importSubscriber';

const app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(static(join(__dirname, 'public')));

app.use('/', healthRouter);
app.use('/import', importRouter);

// init rabbitmq subscriber(s)
const importSubscriber = Container.get(ImportSubscriber);
importSubscriber.subscribeImportBrandsSequence();

export default app;
