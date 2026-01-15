"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlog = exports.getAllBlogs = void 0;
const blog_model_1 = __importDefault(require("../models/blog.model"));
const getAllBlogs = async () => {
    return await blog_model_1.default.find().sort({ createdAt: -1 });
};
exports.getAllBlogs = getAllBlogs;
const createBlog = async (data) => {
    return await blog_model_1.default.create(data);
};
exports.createBlog = createBlog;
