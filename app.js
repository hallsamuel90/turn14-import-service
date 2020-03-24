const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const healthRouter = require('./api/health');
const importRouter = require('./api/import');

const Container = require('typedi').Container;
const ImportSubscriber = require('./subscribers/importSubscriber');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', healthRouter);
app.use('/import', importRouter);

// init rabbitmq subscriber(s)
const importSubscriber = Container.get(ImportSubscriber);
importSubscriber.subscribeImportBrandsSequence();

module.exports = app;
