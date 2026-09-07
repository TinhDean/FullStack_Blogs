import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

/**
 * Handle Mongoose CastError (e.g. invalid ObjectId format)
 */
const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose duplicate key error (E11000)
 */
const handleDuplicateFieldsDB = (err: any): AppError => {
  const keys = err.keyValue ? Object.keys(err.keyValue).join(', ') : 'field';
  const message = `Duplicate value for ${keys}. Please use another value.`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose schema validation error
 */
const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors || {}).map((el: any) => el.message);
  const message = `Dữ liệu không hợp lệ: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle JWT invalid error
 */
const handleJWTError = (): AppError => {
  return new AppError('Token không hợp lệ hoặc đã hết hạn', 401);
};

/**
 * Handle JWT expired error
 */
const handleJWTExpiredError = (): AppError => {
  return new AppError('Token đã hết hạn, vui lòng đăng nhập lại', 401);
};

/**
 * Global Error Handler Middleware
 */
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  error.statusCode = err.statusCode || 500;
  error.message = err.message || 'Lỗi hệ thống';

  // Log server-side for internal 500 errors
  if (error.statusCode === 500) {
    console.error('💥 [Server Error]:', err);
  }

  // 1. Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    error = handleCastErrorDB(err);
  }

  // 2. Mongoose Duplicate Key Error (MongoDB error code 11000)
  if (err.code === 11000) {
    error = handleDuplicateFieldsDB(err);
  }

  // 3. Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    error = handleValidationErrorDB(err);
  }

  // 4. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  const statusCode = error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Do not leak detailed internal error messages for unhandled 500 in production
  let responseMessage = error.message;
  if (statusCode === 500 && isProduction && !error.isOperational) {
    responseMessage = 'Đã có lỗi xảy ra từ hệ thống, vui lòng thử lại sau';
  }

  return res.status(statusCode).json({
    message: responseMessage
  });
};

export default errorMiddleware;
