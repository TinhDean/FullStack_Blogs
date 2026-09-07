import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authMiddleware from './auth.middleware';

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn()
  }
}));

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
};

describe('Auth Middleware', () => {
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    next = vi.fn();
  });

  it('should return 401 if authorization header is missing', () => {
    const req = { headers: {} } as any;
    const res = mockResponse();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Không có quyền truy cập, vui lòng đăng nhập'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not start with Bearer', () => {
    const req = {
      headers: { authorization: 'Basic 123456' }
    } as any;
    const res = mockResponse();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Không có quyền truy cập, vui lòng đăng nhập'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid or verification fails', () => {
    const req = {
      headers: { authorization: 'Bearer invalidtoken' }
    } as any;
    const res = mockResponse();

    (jwt.verify as any).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should attach user payload to req and call next() on valid token', () => {
    const mockUser = {
      userId: 'user123',
      username: 'testuser',
      role: 'user'
    };
    const req = {
      headers: { authorization: 'Bearer validtoken123' }
    } as any;
    const res = mockResponse();

    (jwt.verify as any).mockReturnValue(mockUser);

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
