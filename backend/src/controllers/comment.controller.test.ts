import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import { createComment, getComments, deleteComment } from './comment.controller';
import Comment from '../models/comment.model';

vi.mock('../models/comment.model', () => {
  return {
    default: {
      create: vi.fn(),
      find: vi.fn(),
      findById: vi.fn(),
      findByIdAndDelete: vi.fn()
    }
  };
});

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
};

describe('Comment Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createComment', () => {
    it('TC-INT-03: should create a comment successfully', async () => {
      const req = {
        body: {
          blogId: 'blog123',
          content: 'Bài viết rất hữu ích!'
        },
        user: {
          userId: 'user123',
          username: 'testuser'
        }
      } as any;
      const res = mockResponse();

      const createdComment = {
        _id: 'comment123',
        blogId: 'blog123',
        userId: 'user123',
        username: 'testuser',
        content: 'Bài viết rất hữu ích!'
      };

      (Comment.create as any).mockResolvedValue(createdComment);

      await createComment(req, res);

      expect(Comment.create).toHaveBeenCalledWith({
        blogId: 'blog123',
        userId: 'user123',
        username: 'testuser',
        content: 'Bài viết rất hữu ích!'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdComment);
    });

    it('should return 400 if blogId is missing', async () => {
      const req = {
        body: {
          content: 'Bài viết rất hữu ích!'
        },
        user: {
          userId: 'user123',
          username: 'testuser'
        }
      } as any;
      const res = mockResponse();

      await createComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing data' });
      expect(Comment.create).not.toHaveBeenCalled();
    });

    it('should return 400 if content is missing', async () => {
      const req = {
        body: {
          blogId: 'blog123'
        },
        user: {
          userId: 'user123',
          username: 'testuser'
        }
      } as any;
      const res = mockResponse();

      await createComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing data' });
      expect(Comment.create).not.toHaveBeenCalled();
    });

    it('should return 400 if body is completely empty', async () => {
      const req = {
        body: {},
        user: {
          userId: 'user123',
          username: 'testuser'
        }
      } as any;
      const res = mockResponse();

      await createComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing data' });
      expect(Comment.create).not.toHaveBeenCalled();
    });

    it('should return 500 if database error occurs while creating comment', async () => {
      const req = {
        body: {
          blogId: 'blog123',
          content: 'Lỗi DB'
        },
        user: {
          userId: 'user123',
          username: 'testuser'
        }
      } as any;
      const res = mockResponse();

      (Comment.create as any).mockRejectedValue(new Error('DB Connection Failed'));

      await createComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB Connection Failed' });
    });
  });

  describe('getComments', () => {
    it('should get all comments for a blog sorted by createdAt descending', async () => {
      const req = {
        params: {
          blogId: 'blog123'
        }
      } as any;
      const res = mockResponse();

      const mockComments = [
        {
          _id: 'c1',
          blogId: 'blog123',
          username: 'user1',
          content: 'Bình luận 1',
          createdAt: new Date()
        },
        {
          _id: 'c2',
          blogId: 'blog123',
          username: 'user2',
          content: 'Bình luận 2',
          createdAt: new Date()
        }
      ];

      const mockSort = vi.fn().mockResolvedValue(mockComments);
      (Comment.find as any).mockReturnValue({ sort: mockSort });

      await getComments(req, res);

      expect(Comment.find).toHaveBeenCalledWith({ blogId: 'blog123' });
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(res.json).toHaveBeenCalledWith(mockComments);
    });

    it('should return 500 if database error occurs while fetching comments', async () => {
      const req = {
        params: {
          blogId: 'blog123'
        }
      } as any;
      const res = mockResponse();

      const mockSort = vi.fn().mockRejectedValue(new Error('Fetch error'));
      (Comment.find as any).mockReturnValue({ sort: mockSort });

      await getComments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Fetch error' });
    });
  });

  describe('deleteComment', () => {
    it('should allow user to delete their own comment', async () => {
      const req = {
        params: { id: 'comment123' },
        user: { userId: 'user123', role: 'user' }
      } as any;
      const res = mockResponse();

      (Comment.findById as any).mockResolvedValue({
        _id: 'comment123',
        userId: 'user123',
        content: 'Bình luận của tôi'
      });
      (Comment.findByIdAndDelete as any).mockResolvedValue({});

      await deleteComment(req, res);

      expect(Comment.findById).toHaveBeenCalledWith('comment123');
      expect(Comment.findByIdAndDelete).toHaveBeenCalledWith('comment123');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Delete comment successfully'
      });
    });

    it('should return 403 when a user tries to delete another user comment', async () => {
      const req = {
        params: { id: 'comment123' },
        user: { userId: 'user_attacker', role: 'user' }
      } as any;
      const res = mockResponse();

      (Comment.findById as any).mockResolvedValue({
        _id: 'comment123',
        userId: 'user_victim',
        content: 'Bình luận người khác'
      });

      await deleteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Bạn không có quyền xóa bình luận này'
      });
      expect(Comment.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it('should allow admin to delete any comment', async () => {
      const req = {
        params: { id: 'comment123' },
        user: { userId: 'admin123', role: 'admin' }
      } as any;
      const res = mockResponse();

      (Comment.findById as any).mockResolvedValue({
        _id: 'comment123',
        userId: 'user_victim',
        content: 'Bình luận vi phạm'
      });
      (Comment.findByIdAndDelete as any).mockResolvedValue({});

      await deleteComment(req, res);

      expect(Comment.findByIdAndDelete).toHaveBeenCalledWith('comment123');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Delete comment successfully'
      });
    });

    it('should return 404 if comment is not found', async () => {
      const req = {
        params: { id: 'nonexistent_comment' },
        user: { userId: 'user123', role: 'user' }
      } as any;
      const res = mockResponse();

      (Comment.findById as any).mockResolvedValue(null);

      await deleteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Comment not found'
      });
      expect(Comment.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', async () => {
      const req = {
        params: { id: 'comment123' },
        user: undefined
      } as any;
      const res = mockResponse();

      await deleteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Không có quyền truy cập, vui lòng đăng nhập'
      });
    });

    it('should return 500 if database error occurs while deleting comment', async () => {
      const req = {
        params: { id: 'comment123' },
        user: { userId: 'user123', role: 'user' }
      } as any;
      const res = mockResponse();

      (Comment.findById as any).mockRejectedValue(new Error('DB error'));

      await deleteComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'DB error'
      });
    });
  });
});
