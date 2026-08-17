import dotenv from 'dotenv';
import connectDB from './config/db';
import app from './app';

dotenv.config(); // luôn trên cùng

// debug env
console.log('ENV CHECK:', process.env.MONGO_URI);

// connect DB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
