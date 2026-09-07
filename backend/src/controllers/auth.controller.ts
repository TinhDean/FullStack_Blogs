import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { AuthRequest } from '../interfaces/auth.interface';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const trimmedUsername = typeof username === 'string' ? username.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    // BR-02: Username tối thiểu 3 ký tự
    if (trimmedUsername.length < 3) {
      return res.status(400).json({ message: 'Tên người dùng phải có tối thiểu 3 ký tự' });
    }

    // BR-02: Định dạng email hợp lệ
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({ message: 'Định dạng Email không hợp lệ' });
    }

    // BR-02: Mật khẩu tối thiểu 6 ký tự
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự' });
    }

    // Check trùng username hoặc email
    const existingUser = await User.findOne({
      $or: [{ email: trimmedEmail }, { username: trimmedUsername }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username hoặc Email đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const user = await User.create({
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashedPassword
    });

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Lỗi đăng ký:', error);
    return res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const trimmedAccount = typeof email === 'string' ? email.trim() : '';

    // Tìm user theo email hoặc username
    const user = await User.findOne({
      $or: [
        { email: trimmedAccount.toLowerCase() },
        { username: trimmedAccount }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Lỗi đăng nhập:', error);
    return res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại qua JWT
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Không có quyền truy cập, vui lòng đăng nhập' });
    }

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
    }

    return res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error('Lỗi lấy thông tin user:', error);
    return res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};
