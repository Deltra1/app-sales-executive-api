import { Connection } from 'mongoose';
import { useContainer as routingUserContainer } from 'routing-controllers';
import { Container } from 'typedi';

import config from '../config';

export default (models: any[], connection: Connection) => {
  Container.set('config', config);
  models.forEach((model) => {
    Container.set(model.name, model.model);
  });
  Container.set('dbConnection', connection);
  routingUserContainer(Container);
};
