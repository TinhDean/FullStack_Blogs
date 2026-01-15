"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteBlog = exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const blog_model_1 = __importDefault(require("../models/blog.model"));
/**
 * POST /api/blogs
 */
const createBlog = async (req, res) => {
    try {
        const blog = await blog_model_1.default.create(req.body);
        res.status(201).json(blog);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createBlog = createBlog;
/**
 * GET /api/blogs
 */
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await blog_model_1.default.find({ isDeleted: false });
        res.json(blogs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllBlogs = getAllBlogs;
/**
 * GET /api/blogs/:id
 */
const getBlogById = async (req, res) => {
    try {
        const blog = await blog_model_1.default.findOne({
            _id: req.params.id,
            isDeleted: false
        });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getBlogById = getBlogById;
/**
 * PUT /api/blogs/:id
 * Update toàn bộ bài viết
 */
const updateBlog = async (req, res) => {
    try {
        const blog = await blog_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateBlog = updateBlog;
/**
 * DELETE /api/blogs/:id
 * Xóa cứng
 */
const deleteBlog = async (req, res) => {
    try {
        const blog = await blog_model_1.default.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ message: 'Delete blog successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteBlog = deleteBlog;
/**
 * PATCH /api/blogs/:id
 * Soft delete
 */
const softDeleteBlog = async (req, res) => {
    try {
        const blog = await blog_model_1.default.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ message: 'Soft delete blog successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.softDeleteBlog = softDeleteBlog;
