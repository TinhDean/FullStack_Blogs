// import { Request, Response } from 'express';
// import Blog from '../models/blog.model';

// /**
//  * POST /api/blogs
//  */
// export const createBlog = async (req: Request, res: Response) => {
//   try {
//     const blog = await Blog.create(req.body);
//     res.status(201).json(blog);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * GET /api/blogs
//  */
// export const getAllBlogs = async (req: Request, res: Response) => {
//   try {
//     const blogs = await Blog.find({ isDeleted: false });
//     res.json(blogs);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * GET /api/blogs/:id
//  */
// export const getBlogById = async (req: Request, res: Response) => {
//   try {
//     const blog = await Blog.findOne({
//       _id: req.params.id,
//       isDeleted: false
//     });

//     if (!blog) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }

//     res.json(blog);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * PUT /api/blogs/:id
//  * Update toàn bộ bài viết
//  */
// export const updateBlog = async (req: Request, res: Response) => {
//   try {
//     const blog = await Blog.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     if (!blog) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }

//     res.json(blog);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * DELETE /api/blogs/:id
//  * Xóa cứng
//  */
// export const deleteBlog = async (req: Request, res: Response) => {
//   try {
//     const blog = await Blog.findByIdAndDelete(req.params.id);

//     if (!blog) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }

//     res.json({ message: 'Delete blog successfully' });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * PATCH /api/blogs/:id
//  * Soft delete
//  */
// export const softDeleteBlog = async (req: Request, res: Response) => {
//   try {
//     const blog = await Blog.findByIdAndUpdate(
//       req.params.id,
//       { isDeleted: true },
//       { new: true }
//     );

//     if (!blog) {
//       return res.status(404).json({ message: 'Blog not found' });
//     }

//     res.json({ message: 'Soft delete blog successfully' });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };
