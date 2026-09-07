import dotenv from 'dotenv';
import connectDB from './config/db';
import app from './app';

dotenv.config(); // luôn trên cùng

// Log environment mode (safe, without exposing database credentials)
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

// connect DB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
