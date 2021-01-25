import { resolve } from 'path';

export function getPath(path: string = '') {
  return resolve(__dirname, '../', path);
}
