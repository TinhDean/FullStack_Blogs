import express, { Application } from "express";
import blogRoute from "./routes/blog.route";

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api", blogRoute);

export default app;
