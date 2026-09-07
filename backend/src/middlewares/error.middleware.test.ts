import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import errorMiddleware from './error.middleware';
import notFoundMiddleware from './notFound.middleware';
import AppError from '../utils/appError';

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
};

describe('Error Handling Middleware', () => {
  let next: NextFunction;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.clearAllMocks();
    next = vi.fn();
    // silence console.error during tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  describe('notFoundMiddleware', () => {
    it('should forward an AppError with status 404 to next()', () => {
      const req = {
        method: 'GET',
        originalUrl: '/api/not-existing-endpoint'
      } as Request;
      const res = mockResponse();

      notFoundMiddleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const passedError = (next as any).mock.calls[0][0];
      expect(passedError).toBeInstanceOf(AppError);
      expect(passedError.statusCode).toBe(404);
      expect(passedError.message).toContain('Route not found: GET /api/not-existing-endpoint');
    });
  });

  describe('errorMiddleware', () => {
    it('should handle AppError and return corresponding status and message', () => {
      const err = new AppError('Forbidden action', 403);
      const req = {} as Request;
      const res = mockResponse();

      errorMiddleware(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden action'
      });
    });

    it('should handle Mongoose CastError (invalid ObjectId) with status 400', () => {
      const castError = {
        name: 'CastError',
        path: '_id',
        value: 'invalid-id-123'
      };
      const req = {} as Request;
      const res = mockResponse();

      errorMiddleware(castError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid _id: invalid-id-123'
      });
    });

    it('should handle MongoDB Duplicate Key error (code 11000) with status 400', () => {
      const duplicateError = {
        code: 11000,
        keyValue: { email: 'test@example.com' }
      };
      const req = {} as Request;
      const res = mockResponse();

      errorMiddleware(duplicateError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Duplicate value for email. Please use another value.'
      });
    });

    it('should handle Mongoose ValidationError with status 400', () => {
      const validationError = {
        name: 'ValidationError',
        errors: {
          title: { message: 'Tiêu đề không được để trống' },
          content: { message: 'Nội dung không được để trống' }
        }
      };
      const req = {} as Request;
      const res = mockResponse();

      errorMiddleware(validationError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Dữ liệu không hợp lệ: Tiêu đề không được để trống. Nội dung không được để trống'
      });
    });

    it('should handle JsonWebTokenError with status 401', () => {
      const jwtError = { name: 'JsonWebTokenError' };
      const req = {} as Request;
      const res = mockResponse();

      errorMiddleware(jwtError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    });

    it('should handle TokenExpiredError with status 401', () => {
      const tokenExpiredError = { name: 'TokenExpiredError' };
      const req = {} as Request;
      const res = mockResponse();

      errorMiddleware(tokenExpiredError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token đã hết hạn, vui lòng đăng nhập lại'
      });
    });

    it('should handle unexpected errors in development mode with 500 status', () => {
      process.env.NODE_ENV = 'development';
      const unexpectedError = new Error('Database connection failed');
      const req = {} as Request;
      const res = mockResponse();

      errorMiddleware(unexpectedError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Database connection failed'
      });
    });

    it('should hide internal error details for unexpected 500 in production mode', () => {
      process.env.NODE_ENV = 'production';
      const unexpectedError = new Error('Secret DB URI mongodb://root:pwd@db.internal:27017 leaked');
      const req = {} as Request;
      const res = mockResponse();

      errorMiddleware(unexpectedError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Đã có lỗi xảy ra từ hệ thống, vui lòng thử lại sau'
      });
    });
  });
});
