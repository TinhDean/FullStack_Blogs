// Load environment variables BEFORE any other module is evaluated.
// Modules such as app.ts (CORS allowlist) and auth.* (JWT_SECRET) read
// process.env at import time, so dotenv must run first.
import 'dotenv/config';
import connectDB from './config/db';
import app from './app';

// Log environment mode (safe, without exposing database credentials)
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

// connect DB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
