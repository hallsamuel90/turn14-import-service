import { Express } from 'express';
import logger from 'morgan';
import { createExpressServer, useContainer } from 'routing-controllers';
import Container from 'typedi';

export default (): Express => {
  useContainer(Container);

  const app = createExpressServer({
    controllers: [__dirname + '/../api/*.js'],
  });

  app.use(logger('dev'));

  return app;
};
