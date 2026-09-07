import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { register, login, getMe } from './auth.controller';
import User from '../models/user.model';

vi.mock('../models/user.model', () => {
  return {
    default: {
      findOne: vi.fn(),
      findById: vi.fn(),
      create: vi.fn()
    }
  };
});

vi.mock('bcryptjs', () => ({
  default: {
    genSalt: vi.fn().mockResolvedValue('mockSalt'),
    hash: vi.fn().mockResolvedValue('hashedPassword123'),
    compare: vi.fn()
  }
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockReturnValue('mockJwtToken123'),
    verify: vi.fn()
  }
}));

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
};

describe('Auth Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('TC-AUTH-01: should register a new user successfully', async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'testuser@gmail.com',
          password: 'password123'
        }
      } as any;
      const res = mockResponse();

      (User.findOne as any).mockResolvedValue(null);
      (User.create as any).mockResolvedValue({
        _id: 'mockUserId123',
        username: 'testuser',
        email: 'testuser@gmail.com',
        role: 'user'
      });

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ email: 'testuser@gmail.com' }, { username: 'testuser' }]
      });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'mockSalt');
      expect(User.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'testuser@gmail.com',
        password: 'hashedPassword123'
      });
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        token: 'mockJwtToken123',
        user: {
          id: 'mockUserId123',
          username: 'testuser',
          email: 'testuser@gmail.com',
          role: 'user'
        }
      });
    });

    it('TC-AUTH-02: should return 400 if password is less than 6 chars', async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@gmail.com',
          password: '12345'
        }
      } as any;
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự'
      });
    });

    it('should return 400 if username is less than 3 chars', async () => {
      const req = {
        body: {
          username: 'ab',
          email: 'test@gmail.com',
          password: 'password123'
        }
      } as any;
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tên người dùng phải có tối thiểu 3 ký tự'
      });
    });

    it('should return 400 if email format is invalid', async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'invalid-email',
          password: 'password123'
        }
      } as any;
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Định dạng Email không hợp lệ'
      });
    });

    it('should return 400 if missing required fields', async () => {
      const req = {
        body: {
          username: '',
          email: '',
          password: ''
        }
      } as any;
      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    });

    it('TC-AUTH-03: should return 400 if email or username already exists', async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'testuser@gmail.com',
          password: 'password123'
        }
      } as any;
      const res = mockResponse();

      (User.findOne as any).mockResolvedValue({
        _id: 'existingUser',
        email: 'testuser@gmail.com'
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Username hoặc Email đã tồn tại'
      });
    });
  });

  describe('login', () => {
    it('TC-AUTH-04: should login successfully with valid credentials', async () => {
      const req = {
        body: {
          email: 'testuser@gmail.com',
          password: 'password123'
        }
      } as any;
      const res = mockResponse();

      (User.findOne as any).mockResolvedValue({
        _id: 'mockUserId123',
        username: 'testuser',
        email: 'testuser@gmail.com',
        password: 'hashedPassword123',
        role: 'user'
      });
      (bcrypt.compare as any).mockResolvedValue(true);

      await login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        token: 'mockJwtToken123',
        user: {
          id: 'mockUserId123',
          username: 'testuser',
          email: 'testuser@gmail.com',
          role: 'user'
        }
      });
    });

    it('should return 400 if credentials are missing', async () => {
      const req = {
        body: {
          email: '',
          password: ''
        }
      } as any;
      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    });

    it('should return 400 if user is not found', async () => {
      const req = {
        body: {
          email: 'nonexistent@gmail.com',
          password: 'password123'
        }
      } as any;
      const res = mockResponse();

      (User.findOne as any).mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tài khoản hoặc mật khẩu không chính xác'
      });
    });

    it('should return 400 if password does not match', async () => {
      const req = {
        body: {
          email: 'testuser@gmail.com',
          password: 'wrongpassword'
        }
      } as any;
      const res = mockResponse();

      (User.findOne as any).mockResolvedValue({
        _id: 'mockUserId123',
        password: 'hashedPassword123'
      });
      (bcrypt.compare as any).mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tài khoản hoặc mật khẩu không chính xác'
      });
    });
  });

  describe('getMe', () => {
    it('should return user info when authenticated', async () => {
      const req = {
        user: {
          userId: 'mockUserId123',
          username: 'testuser',
          role: 'user'
        }
      } as any;
      const res = mockResponse();

      const mockSelect = vi.fn().mockResolvedValue({
        _id: 'mockUserId123',
        username: 'testuser',
        email: 'testuser@gmail.com',
        role: 'user'
      });
      (User.findById as any).mockReturnValue({ select: mockSelect });

      await getMe(req, res);

      expect(User.findById).toHaveBeenCalledWith('mockUserId123');
      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: 'mockUserId123',
          username: 'testuser',
          email: 'testuser@gmail.com',
          role: 'user'
        }
      });
    });

    it('should return 401 if user is not in request', async () => {
      const req = { user: undefined } as any;
      const res = mockResponse();

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 404 if user does not exist in DB', async () => {
      const req = {
        user: {
          userId: 'nonexistent123',
          username: 'ghost',
          role: 'user'
        }
      } as any;
      const res = mockResponse();

      const mockSelect = vi.fn().mockResolvedValue(null);
      (User.findById as any).mockReturnValue({ select: mockSelect });

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Không tìm thấy thông tin người dùng'
      });
    });
  });
});
