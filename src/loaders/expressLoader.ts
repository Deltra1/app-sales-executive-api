import { useExpressServer } from 'routing-controllers';
import bodyParser from 'body-parser';

import config from '../config';
import { currentUserChecker } from '../middlewares/AuthMiddleware';

export default (mainConfig: any) => {
  mainConfig.expressApp.use(bodyParser.json());
  const app = useExpressServer(mainConfig.expressApp, {
    currentUserChecker,
    defaultErrorHandler: false,
    controllers: [config.app.controllersDir],
    middlewares: [config.app.middlewaresDir],
  });
  return app;
};
