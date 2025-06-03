import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import routes
import notesRoutes from './routes/notes.routes';
import flashcardRoutes from './routes/flashcard.routes';
import exportRoutes from './routes/export.routes';

// Import the multer error handler from notes.routes
import { handleMulterError } from './routes/notes.routes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Smart Notes API is running!'
  });
});

// API Routes
app.use('/api/notes', notesRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/export', exportRoutes);

// Error handling middleware
app.use(handleMulterError);

// Global error handler
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    // Use the MongoDB URI from environment variables or fallback to local
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studysmartbuddy';
    
    console.log(`Attempting to connect to MongoDB...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10
    });
    
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    
    // Add connection error handler
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    // Add reconnection handler
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected, attempting to reconnect...');
      setTimeout(connectDB, 5000);
    });
    
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Start server
const startServer = async () => {
  try {
    // Try to connect to MongoDB
    const connected = await connectDB();
    
    if (!connected) {
      console.warn('Warning: Could not connect to MongoDB. Some features may not work.');
    }
    
    // Start the server even if MongoDB connection fails
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`AI Provider: ${process.env.AI_PROVIDER || 'openrouter'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  // Don't exit the process, just log the error
});

startServer();