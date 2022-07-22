export default class BaseError extends Error {
  date: any;
  name: string;

  constructor(msg, ...options) {
    super(...options);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseError);
    }
    this.name = 'BaseError';
    this.date = new Date();
  }
}
