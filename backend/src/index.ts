import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import bookingRoutes from './routes/bookings';
import jobRoutes from './routes/jobs';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root redirect
app.get('/', (_req, res) => {
  res.json({ 
    message: 'HandySwift API Server', 
    health: '/health',
    docs: 'API running at /api/*',
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);

// API root endpoint
app.get('/api', (_req, res) => {
  res.json({
    message: 'HandySwift API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      bookings: '/api/bookings',
      admin: '/api/admin',
      health: '/health'
    }
  });
});
      health: '/health'
    }
  });
});

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: 'Route not found',
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
});

// Error Handler
app.use((err: any, _req: express.Request, res: express.Response) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Internal server error',
    statusCode: 500,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
