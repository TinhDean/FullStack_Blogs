"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHellos = exports.getBlogs = void 0;
const blog_service_1 = require("../services/blog.service");
const getBlogs = (req, res) => {
    const result = (0, blog_service_1.getAllBlogs)();
    res.status(200).json({
        data: result
    });
};
exports.getBlogs = getBlogs;
const getHellos = (req, res) => {
    const result = (0, blog_service_1.getAllHellos)();
    res.status(200).json({
        data: result
    });
};
exports.getHellos = getHellos;
