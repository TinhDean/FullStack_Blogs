import { Request, Response } from 'express';
import Comment from '../models/comment.model';
import { AuthRequest } from '../interfaces/auth.interface';

/**
 * Unexpected errors are forwarded automatically by Express 5 to the
 * global error middleware (see middlewares/error.middleware.ts).
 */

/**
 * POST /api/comments
 */
export const createComment = async (req: AuthRequest, res: Response) => {
  const { blogId } = req.body ?? {};
  const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';

  if (!blogId || !content) {
    return res.status(400).json({ message: 'Missing data' });
  }

  const comment = await Comment.create({
    blogId,
    userId: req.user?.userId,
    username: req.user?.username,
    content
  });

  return res.status(201).json(comment);
};

/**
 * GET /api/comments/:blogId
 */
export const getComments = async (req: Request, res: Response) => {
  const comments = await Comment.find({
    blogId: req.params.blogId
  }).sort({ createdAt: -1 });

  return res.json(comments);
};

/**
 * DELETE /api/comments/:id
 * Chỉ chủ bình luận hoặc admin được xóa
 */
export const deleteComment = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;

  if (!userId) {
    return res.status(401).json({ message: 'Không có quyền truy cập, vui lòng đăng nhập' });
  }

  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  const isAuthor = comment.userId && comment.userId.toString() === userId;
  const isAdmin = role === 'admin';

  if (!isAuthor && !isAdmin) {
    return res.status(403).json({ message: 'Bạn không có quyền xóa bình luận này' });
  }

  await Comment.findByIdAndDelete(req.params.id);

  return res.json({ message: 'Delete comment successfully' });
};