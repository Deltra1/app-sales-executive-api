import { IConfig } from '../config';
import IErrorObj from '../errors/IErrorObj';

declare global {
  namespace App {
    export type Config = IConfig;
    export type ErrorObj = IErrorObj;
  }
}
