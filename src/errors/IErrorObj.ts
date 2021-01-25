export default interface IErrorObj {
  message?: string;
  httpCode?: number;
  description?: string;
  error?: Error | null;
}
