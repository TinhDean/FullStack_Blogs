"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const router = (0, express_1.Router)();
router.get("/blogs", blog_controller_1.getBlogs);
router.get("/hellos", blog_controller_1.getHellos);
exports.default = router;
