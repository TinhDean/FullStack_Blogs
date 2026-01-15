"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const blog_route_1 = __importDefault(require("./routes/blog.route"));
dotenv_1.default.config(); // luôn trên cùng
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
// debug env
console.log('ENV CHECK:', process.env.MONGO_URI);
// connect DB
(0, db_1.default)();
// routes
app.use('/api/blogs', blog_route_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
