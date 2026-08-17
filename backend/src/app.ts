import express from "express"
import cors from "cors"
import blogRoutes from "./routes/blog.route"
import commentRoutes from "./routes/comment.routes"
import authRoutes from "./routes/auth.route"

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);

export default app;
