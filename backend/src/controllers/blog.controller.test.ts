import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';

import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  softDeleteBlog
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

  it('should create a blog', async () => {
    const req = {
      body: { title: 'Test', content: 'Content' },
      user: { userId: 'user123' }
    } as any;

    const res = mockResponse();

    (Blog.create as any).mockResolvedValue(req.body);

    await createBlog(req, res);

    expect(Blog.create).toHaveBeenCalledWith({
      title: 'Test',
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
});
