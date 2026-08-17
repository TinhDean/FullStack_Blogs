// src/middlewares/logger.middleware.ts
import { Request, Response, NextFunction } from 'express';

const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const method = req.method;
  const url = req.originalUrl;

  const now = new Date();
  const time = now.toLocaleString('vi-VN');

  console.log(`[${method}][${url}][${time}]`);

  // Cho phép request đi tiếp tới Controller
  next();
};

export default loggerMiddleware;
