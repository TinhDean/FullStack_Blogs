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