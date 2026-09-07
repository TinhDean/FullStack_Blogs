import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export default notFoundMiddleware;
