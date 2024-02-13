import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error";
import { handleError } from "./error-handler";

describe('handleError', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should handle HttpError with status and message', () => {
    const error = new HttpError('Not Found', 404);

    handleError(error as HttpError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Not Found' });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle HttpError with only message', () => {
    const error = new HttpError('Internal Server Error');

    handleError(error as HttpError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Internal Server Error' });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle unknown errors', () => {
    const error = new Error('Unknown Error');

    handleError(error as HttpError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ mensagem: 'Unknown Error' });
    expect(mockNext).toHaveBeenCalled();
  });
});
