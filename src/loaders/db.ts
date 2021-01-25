import mongoose, { Connection } from 'mongoose';
import { Db } from 'mongodb';

import config from '../config';

export default async (): Promise<Connection> => {
  const connection = await mongoose.connect(config.db.mongodbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  return connection.connection;
};
