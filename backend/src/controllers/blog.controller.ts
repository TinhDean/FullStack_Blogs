import { Request, Response } from 'express';
import Blog from '../models/blog.model';
import { AuthRequest } from '../interfaces/auth.interface';

/**
 * Error handling note:
 * Express 5 automatically forwards rejected promises from async handlers to
 * `next(error)`, so unexpected errors (DB failures, CastError, ValidationError...)
 * are handled centrally by `middlewares/error.middleware.ts`.
 */

// Only these fields can be written by clients. Prevents mass-assignment of
// `author`, `views`, `likes` or `isDeleted` through the request body.
const EDITABLE_FIELDS = ['title', 'content', 'category', 'thumbnail'] as const;

const pickEditableFields = (body: Record<string, unknown> = {}) => {
  const data: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) {
    const value = body[field];
    if (value !== undefined) {
      data[field] = typeof value === 'string' ? value.trim() : value;
    }
  }
  return data;
};

const isBlank = (value: unknown) => typeof value !== 'string' || value.trim() === '';

const canModify = (blog: { author?: unknown }, user: AuthRequest['user']) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return !blog.author || String(blog.author) === user.userId;
};

/**
 * POST /api/blogs
 */
export const createBlog = async (req: AuthRequest, res: Response) => {
  const data = pickEditableFields(req.body);

  // BR-04: title & content are required and cannot be whitespace only
  if (isBlank(data.title) || isBlank(data.content)) {
    return res.status(400).json({ message: 'Tiêu đề và Nội dung bài viết không được để trống' });
  }

  const blog = await Blog.create({
    ...data,
    author: req.user?.userId
  });
  return res.status(201).json(blog);
};

/**
 * GET /api/blogs
 */
export const getAllBlogs = async (req: Request, res: Response) => {
  const category = req.query?.category;
  const page = Math.max(parseInt(req.query?.page as string) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query?.limit as string) || 6, 1), 100);
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = { isDeleted: false };
  if (category) {
    query.category = category;
  }

  const total = await Blog.countDocuments(query);
  const blogs = await Blog.find(query)
    .populate('author', 'username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.json({
    blogs,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalBlogs: total
  });
};

/**
 * GET /api/blogs/:id
 */
export const getBlogById = async (req: Request, res: Response) => {
  const blog = await Blog.findOne({
    _id: req.params.id,
    isDeleted: false
  }).populate('author', 'username');

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  return res.json(blog);
};

/**
 * PUT /api/blogs/:id
 * Update bài viết (chỉ tác giả hoặc admin)
 */
export const updateBlog = async (req: AuthRequest, res: Response) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  if (!canModify(blog, req.user)) {
    return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa bài viết này' });
  }

  const data = pickEditableFields(req.body);

  // BR-04: if title/content are sent, they cannot be blank
  if ((data.title !== undefined && isBlank(data.title)) || (data.content !== undefined && isBlank(data.content))) {
    return res.status(400).json({ message: 'Tiêu đề và Nội dung bài viết không được để trống' });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });

  return res.json(updatedBlog);
};

/**
 * DELETE /api/blogs/:id
 * Xóa cứng (cascade xóa comments qua hook của model)
 */
export const deleteBlog = async (req: AuthRequest, res: Response) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  if (!canModify(blog, req.user)) {
    return res.status(403).json({ message: 'Bạn không có quyền xóa bài viết này' });
  }

  await Blog.findByIdAndDelete(req.params.id);
  return res.json({ message: 'Delete blog successfully' });
};

/**
 * PATCH /api/blogs/:id
 * Soft delete
 */
export const softDeleteBlog = async (req: AuthRequest, res: Response) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  if (!canModify(blog, req.user)) {
    return res.status(403).json({ message: 'Bạn không có quyền xóa bài viết này' });
  }

  await Blog.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });

  return res.json({ message: 'Soft delete blog successfully' });
};

/**
 * PATCH /api/blogs/:id/view
 */
export const increaseView = async (req: Request, res: Response) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  return res.json(blog);
};

/**
 * PATCH /api/blogs/:id/like
 */
export const likeBlog = async (req: Request, res: Response) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { $inc: { likes: 1 } },
    { new: true }
  );

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  return res.json(blog);
};

/**
 * GET /api/blogs/search?search=keyword
 */
export const searchBlogs = async (req: Request, res: Response) => {
  const rawKeyword = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  // Escape regex special characters so user input is matched literally
  const keyword = rawKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const blogs = await Blog.find({
    title: { $regex: keyword, $options: 'i' },
    isDeleted: false
  })
    .populate('author', 'username')
    .sort({ createdAt: -1 });

  return res.json(blogs);
};

/**
 * GET /api/blogs/user/me
 * Lấy danh sách bài viết của user hiện tại kèm thống kê
 */
export const getMyBlogs = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Không có quyền truy cập, vui lòng đăng nhập' });
  }

  const blogs = await Blog.find({
    author: userId,
    isDeleted: false
  }).sort({ createdAt: -1 });

  const totalBlogs = blogs.length;
  const totalViews = blogs.reduce((sum: number, blog: { views?: number }) => sum + (blog.views || 0), 0);
  const totalLikes = blogs.reduce((sum: number, blog: { likes?: number }) => sum + (blog.likes || 0), 0);

  return res.json({
    blogs,
    stats: {
      totalBlogs,
      totalViews,
      totalLikes
    }
  });
};
