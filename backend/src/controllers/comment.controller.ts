import { Request, Response } from "express";
import Comment from "../models/comment.model";
import Blog from "../models/blog.model";

/**
 * POST /api/comments
 */
export const createComment = async (req: any, res: Response) => {
  try {
    const { blogId, content } = req.body;

    console.log("BODY:", req.body); // 👈 debug

    if (!blogId || !content) {
      return res.status(400).json({ message: "Missing data" });
    }

    const comment = await Comment.create({
      blogId,
      userId: req.user.userId,
      username: req.user.username,
      content
    });

    return res.status(201).json(comment);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/comments/:blogId
 */
export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({
      blogId: req.params.blogId
    }).sort({ createdAt: -1 });

    return res.json(comments);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/comments/:id
 */
export const deleteComment = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: "Không có quyền truy cập, vui lòng đăng nhập" });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isAuthor = comment.userId && comment.userId.toString() === userId;
    const isAdmin = role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền xóa bình luận này" });
    }

    await Comment.findByIdAndDelete(req.params.id);

    return res.json({ message: "Delete comment successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Lỗi hệ thống" });
  }
};