import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import blogRoutes from './routes/blog.route';

dotenv.config(); // luôn trên cùng

const app = express();

// middleware
app.use(express.json());

// debug env
console.log('ENV CHECK:', process.env.MONGO_URI);

// connect DB
connectDB();

// routes
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
