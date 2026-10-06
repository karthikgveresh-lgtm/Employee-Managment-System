/**
 * @file server.ts
 * @description Main Express application server for GUPIO Employee Management System.
 * Connects to MongoDB, sets up REST API endpoints, handles CORS & JSON parsing,
 * and mounts Vite development middleware in dev mode.
 */

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB, { dbState } from './backend/config/db.ts';
import employeeRoutes from './backend/routes/employeeRoutes.ts';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.path}`);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'GUPIO Employee Management System',
    database: {
      connected: dbState.isConnected,
      mode: dbState.isConnected ? 'MongoDB Mongoose' : 'Schema-Validated In-Memory Sandbox',
      uri: dbState.uriUsed,
      lastError: dbState.lastError,
    },
  });
});

// Mount Employee CRUD API Routes
app.use('/api/employees', employeeRoutes);

// 404 handler for unknown API routes
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.path} not found.`,
  });
});

/**
 * Setup Vite dev server or serve production build
 */
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // In development: mount Vite dev middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // In production: serve static build assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GUPIO EMS Server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 API Endpoints available at http://localhost:${PORT}/api/employees`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});
