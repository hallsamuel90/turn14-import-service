import { Express } from 'express';
import logger from 'morgan';
import { createExpressServer, useContainer } from 'routing-controllers';
import Container from 'typedi';

/**
 * Configures the express app.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 * @returns {Express} the configured express app.
 */
export default (): Express => {
  useContainer(Container); // lets express know to use typedi

  const app = createExpressServer({
    controllers: [__dirname + '/../api/*.js'],
  });

  app.use(logger('dev'));

  return app;
};
