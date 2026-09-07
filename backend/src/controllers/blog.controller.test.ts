import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';

import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  softDeleteBlog,
  getMyBlogs
} from './blog.controller';

import Blog from '../models/blog.model';

vi.mock('../models/blog.model', () => {
  return {
    default: {
      create: vi.fn(),
      find: vi.fn(),
      findOne: vi.fn(),
      findById: vi.fn(),
      findByIdAndUpdate: vi.fn(),
      findByIdAndDelete: vi.fn(),
      findOneAndUpdate: vi.fn(),
      countDocuments: vi.fn()
    }
  };
});

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
};

describe('Blog Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a blog with thumbnail', async () => {
    const req = {
      body: { title: 'Test with Thumbnail', content: 'Content', category: 'AI', thumbnail: 'https://example.com/cover.jpg' },
      user: { userId: 'user123' }
    } as any;

    const res = mockResponse();

    (Blog.create as any).mockResolvedValue(req.body);

    await createBlog(req, res);

    expect(Blog.create).toHaveBeenCalledWith({
      title: 'Test with Thumbnail',
      content: 'Content',
      category: 'AI',
      thumbnail: 'https://example.com/cover.jpg',
      author: 'user123'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('should create a blog without thumbnail', async () => {
    const req = {
      body: { title: 'Test without Thumbnail', content: 'Content' },
      user: { userId: 'user123' }
    } as any;

    const res = mockResponse();

    (Blog.create as any).mockResolvedValue(req.body);

    await createBlog(req, res);

    expect(Blog.create).toHaveBeenCalledWith({
      title: 'Test without Thumbnail',
      content: 'Content',
      author: 'user123'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('should get all blogs (not deleted)', async () => {
    const req = {} as any;
    const res = mockResponse();

    const mockLimit = vi.fn().mockResolvedValue([]);
    const mockSkip = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockSort = vi.fn().mockReturnValue({ skip: mockSkip });
    const mockPopulate = vi.fn().mockReturnValue({ sort: mockSort });
    const mockFind = {
      populate: mockPopulate
    };
    (Blog.find as any).mockReturnValue(mockFind);
    (Blog.countDocuments as any).mockResolvedValue(0);

    await getAllBlogs(req, res);

    expect(Blog.find).toHaveBeenCalledWith({ isDeleted: false });
    expect(mockPopulate).toHaveBeenCalledWith('author', 'username');
    expect(res.json).toHaveBeenCalledWith({
      blogs: [],
      currentPage: 1,
      totalPages: 0,
      totalBlogs: 0
    });
  });

  it('should get blog by id', async () => {
    const req = {
      params: { id: '1' }
    } as any;

    const res = mockResponse();

    const mockFindOne = {
      populate: vi.fn().mockResolvedValue({ title: 'Blog' })
    };
    (Blog.findOne as any).mockReturnValue(mockFindOne);

    await getBlogById(req, res);

    expect(Blog.findOne).toHaveBeenCalledWith({ _id: '1', isDeleted: false });
    expect(mockFindOne.populate).toHaveBeenCalledWith('author', 'username');
    expect(res.json).toHaveBeenCalled();
  });

  it('should return 404 if blog not found', async () => {
    const req = {
      params: { id: '999' }
    } as any;

    const res = mockResponse();

    const mockFindOne = {
      populate: vi.fn().mockResolvedValue(null)
    };
    (Blog.findOne as any).mockReturnValue(mockFindOne);

    await getBlogById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Blog not found' });
  });

  it('should update a blog', async () => {
    const req = {
      params: { id: '1' },
      body: { title: 'Updated' },
      user: { userId: 'user123', role: 'user' }
    } as any;

    const res = mockResponse();

    (Blog.findById as any).mockResolvedValue({
      _id: '1',
      title: 'Blog',
      author: 'user123'
    });
    (Blog.findByIdAndUpdate as any).mockResolvedValue(req.body);

    await updateBlog(req, res);

    expect(Blog.findById).toHaveBeenCalledWith('1');
    expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith('1', req.body, { new: true, runValidators: true });
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should update a blog thumbnail', async () => {
    const req = {
      params: { id: '1' },
      body: { thumbnail: 'https://example.com/new-cover.jpg' },
      user: { userId: 'user123', role: 'user' }
    } as any;

    const res = mockResponse();

    (Blog.findById as any).mockResolvedValue({
      _id: '1',
      title: 'Blog',
      author: 'user123'
    });
    (Blog.findByIdAndUpdate as any).mockResolvedValue(req.body);

    await updateBlog(req, res);

    expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith('1', req.body, { new: true, runValidators: true });
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should allow removing a thumbnail with empty string', async () => {
    const req = {
      params: { id: '1' },
      body: { thumbnail: '' },
      user: { userId: 'user123', role: 'user' }
    } as any;

    const res = mockResponse();

    (Blog.findById as any).mockResolvedValue({
      _id: '1',
      title: 'Blog',
      thumbnail: 'https://example.com/old-cover.jpg',
      author: 'user123'
    });
    (Blog.findByIdAndUpdate as any).mockResolvedValue(req.body);

    await updateBlog(req, res);

    expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith('1', { thumbnail: '' }, { new: true, runValidators: true });
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should delete a blog', async () => {
    const req = {
      params: { id: '1' },
      user: { userId: 'user123', role: 'user' }
    } as any;

    const res = mockResponse();

    (Blog.findById as any).mockResolvedValue({
      _id: '1',
      title: 'Blog',
      author: 'user123'
    });
    (Blog.findByIdAndDelete as any).mockResolvedValue({});

    await deleteBlog(req, res);

    expect(Blog.findById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({
      message: 'Delete blog successfully'
    });
  });

  it('should soft delete a blog', async () => {
    const req = {
      params: { id: '1' },
      user: { userId: 'user123', role: 'user' }
    } as any;

    const res = mockResponse();

    (Blog.findById as any).mockResolvedValue({
      _id: '1',
      title: 'Blog',
      author: 'user123'
    });
    (Blog.findByIdAndUpdate as any).mockResolvedValue({ isDeleted: true });

    await softDeleteBlog(req, res);

    expect(Blog.findById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({
      message: 'Soft delete blog successfully'
    });
  });

  describe('getMyBlogs', () => {
    it('should get all blogs for the authenticated user and compute stats correctly', async () => {
      const req = {
        user: { userId: 'user123' }
      } as any;
      const res = mockResponse();

      const mockBlogs = [
        { _id: '1', title: 'Blog 1', views: 100, likes: 25, author: 'user123' },
        { _id: '2', title: 'Blog 2', views: 50, likes: 10, author: 'user123' }
      ];

      const mockSort = vi.fn().mockResolvedValue(mockBlogs);
      (Blog.find as any).mockReturnValue({ sort: mockSort });

      await getMyBlogs(req, res);

      expect(Blog.find).toHaveBeenCalledWith({
        author: 'user123',
        isDeleted: false
      });
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(res.json).toHaveBeenCalledWith({
        blogs: mockBlogs,
        stats: {
          totalBlogs: 2,
          totalViews: 150,
          totalLikes: 35
        }
      });
    });

    it('should return empty blogs and 0 stats if user has no blogs', async () => {
      const req = {
        user: { userId: 'user_new' }
      } as any;
      const res = mockResponse();

      const mockSort = vi.fn().mockResolvedValue([]);
      (Blog.find as any).mockReturnValue({ sort: mockSort });

      await getMyBlogs(req, res);

      expect(Blog.find).toHaveBeenCalledWith({
        author: 'user_new',
        isDeleted: false
      });
      expect(res.json).toHaveBeenCalledWith({
        blogs: [],
        stats: {
          totalBlogs: 0,
          totalViews: 0,
          totalLikes: 0
        }
      });
    });

    it('should safely handle blogs with undefined views and likes (default to 0)', async () => {
      const req = {
        user: { userId: 'user123' }
      } as any;
      const res = mockResponse();

      const mockBlogs = [
        { _id: '1', title: 'Blog without views or likes', author: 'user123' }
      ];

      const mockSort = vi.fn().mockResolvedValue(mockBlogs);
      (Blog.find as any).mockReturnValue({ sort: mockSort });

      await getMyBlogs(req, res);

      expect(res.json).toHaveBeenCalledWith({
        blogs: mockBlogs,
        stats: {
          totalBlogs: 1,
          totalViews: 0,
          totalLikes: 0
        }
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      const req = { user: undefined } as any;
      const res = mockResponse();

      await getMyBlogs(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Không có quyền truy cập, vui lòng đăng nhập'
      });
    });

    it('should return 500 if database error occurs', async () => {
      const req = {
        user: { userId: 'user123' }
      } as any;
      const res = mockResponse();

      const mockSort = vi.fn().mockRejectedValue(new Error('Database query failure'));
      (Blog.find as any).mockReturnValue({ sort: mockSort });

      await getMyBlogs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Database query failure'
      });
    });
  });
});

