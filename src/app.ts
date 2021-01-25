import 'reflect-metadata';
import express, { Application } from 'express';

import loaders from './loaders';

const app: Application = express();

loaders({ expressApp: app });
export default app;
