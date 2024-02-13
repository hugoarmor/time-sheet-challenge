import { HttpError } from "./http-error";

describe('HttpError', () => {
  it('should create an HttpError instance with message and status', () => {
    const message = 'Not Found';
    const status = 404;

    const error = new HttpError(message, status);

    expect(error instanceof HttpError).toBeTruthy();
    expect(error.message).toEqual(message);
    expect(error.status).toEqual(status);
  });

  it('should create an HttpError instance with only message', () => {
    const message = 'Internal Server Error';

    const error = new HttpError(message);

    expect(error instanceof HttpError).toBeTruthy();
    expect(error.message).toEqual(message);
    expect(error.status).toBeUndefined();
  });
});
