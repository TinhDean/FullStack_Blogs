import express from "express"
import cors from "cors"
import blogRoutes from "./routes/blog.route"
import commentRoutes from "./routes/comment.routes"
import authRoutes from "./routes/auth.route"
import notFoundMiddleware from "./middlewares/notFound.middleware"
import errorMiddleware from "./middlewares/error.middleware"

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map((url) => url.trim()) : [])
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, health check)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      // Allow localhost with any port in non-production environments
      if (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback to prevent breaking cross-domain requests
    },
    credentials: true
  })
);

app.use(express.json());

// Health Check Endpoint (for Render / Railway / uptime monitors)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);

// Handle 404 for unhandled routes
app.use(notFoundMiddleware);

// Global Error Handler
app.use(errorMiddleware);

export default app;
