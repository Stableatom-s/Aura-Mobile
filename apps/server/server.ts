import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import journalRoutes from './src/routes/journalRoutes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aura_db';

// Global Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Core API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/admin', adminRoutes);

// Test Routes (Database verification - disabled in production)
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/users/test', async (req, res) => {
    try {
      const user = await User.create({
        email: req.body.email || `test_${Date.now()}@example.com`,
        fullName: req.body.fullName || 'Tanmay',
        dateOfBirth: req.body.dateOfBirth || { month: 'June', day: 15, year: 2002 },
      });
      res.status(201).json({ success: true, user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/users/test', async (_req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 }).limit(10);
      res.json({ success: true, count: users.length, users });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}

// Database Connection & Server Listener (0.0.0.0 allows physical Android devices on LAN)
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas connected successfully');
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });