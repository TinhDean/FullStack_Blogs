import { Router } from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  softDeleteBlog,
  increaseView,
  likeBlog,
  searchBlogs
} from '../controllers/blog.controller';
import loggerMiddleware from '../middlewares/logger.middleware';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// áp dụng middlewares cho toàn bộ routes
router.use(loggerMiddleware);

router.post('/', authMiddleware, createBlog);
router.get('/', getAllBlogs);
router.get("/search", searchBlogs);
router.get('/:id', getBlogById);
router.put('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);
router.patch('/:id', authMiddleware, softDeleteBlog);
router.patch("/:id/view", increaseView);
router.patch("/:id/like", likeBlog);


export default router;
