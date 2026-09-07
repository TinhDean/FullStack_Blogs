import express from "express"
import cors from "cors"
import blogRoutes from "./routes/blog.route"
import commentRoutes from "./routes/comment.routes"
import authRoutes from "./routes/auth.route"
import notFoundMiddleware from "./middlewares/notFound.middleware"
import errorMiddleware from "./middlewares/error.middleware"

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);

// Handle 404 for unhandled routes
app.use(notFoundMiddleware);

// Global Error Handler
app.use(errorMiddleware);

export default app;
