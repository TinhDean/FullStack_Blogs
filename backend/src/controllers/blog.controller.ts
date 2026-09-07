import { Request, Response } from 'express';
import Blog from '../models/blog.model';

/**
 * POST /api/blogs
 */
export const createBlog = async (req: any, res: Response) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      author: req.user.userId
    });
    res.status(201).json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/blogs
 */
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const category = req.query?.category;
    const page = parseInt(req.query?.page as string) || 1;
    const limit = parseInt(req.query?.limit as string) || 6;
    const skip = (page - 1) * limit;

    const query: any = { isDeleted: false };
    if (category) {
      query.category = category;
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/blogs/:id
 */
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate('author', 'username');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/blogs/:id
 * Update toàn bộ bài viết
 */
export const updateBlog = async (req: any, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author && blog.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa bài viết này' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedBlog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/blogs/:id
 * Xóa cứng
 */
export const deleteBlog = async (req: any, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author && blog.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa bài viết này' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Delete blog successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /api/blogs/:id
 * Soft delete
 */
export const softDeleteBlog = async (req: any, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author && blog.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa bài viết này' });
    }

    await Blog.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    res.json({ message: 'Soft delete blog successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const increaseView = async (req: Request, res: Response) => {

  try {

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )

    res.json(blog)

  } catch (error) {

    res.status(500).json({ message: "Error increasing view" })

  }

};

export const likeBlog = async (req: Request, res: Response) => {
  try {

    const blog = await Blog.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false
      },
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.json(blog);

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const searchBlogs = async (req: Request, res: Response) => {
  try {

    const keyword = (req.query.search as string) || "";

    const blogs = await Blog.find({
      title: { $regex: keyword, $options: "i" },
      isDeleted: false
    });

    return res.json(blogs);

  } catch (error) {

    console.error(error);

    return res.status(500).json([]);

  }
};

/**
 * GET /api/blogs/user/me
 * Lấy danh sách bài viết của user hiện tại kèm thống kê
 */
export const getMyBlogs = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Không có quyền truy cập, vui lòng đăng nhập' });
    }

    const blogs = await Blog.find({
      author: userId,
      isDeleted: false
    }).sort({ createdAt: -1 });

    const totalBlogs = blogs.length;
    const totalViews = blogs.reduce((sum: number, blog: any) => sum + (blog.views || 0), 0);
    const totalLikes = blogs.reduce((sum: number, blog: any) => sum + (blog.likes || 0), 0);

    return res.json({
      blogs,
      stats: {
        totalBlogs,
        totalViews,
        totalLikes
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

