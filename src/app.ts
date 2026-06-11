import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.config';
import { errorMiddleware } from './middlewares/error.middleware';
import { ApiSuccessResponse } from './utils/api-response.util';
import { HTTP_STATUS } from './constants/http-status.constants';
import productsRouter from './app/products/products.routes';

const createApp = (): express.Application => {
  const app = express();

  // ── Security & Utility Middlewares ─────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

  // ── Health Check ───────────────────────────────────────────────────────────
  app.get('/health', (_req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK).json(
      new ApiSuccessResponse('Server is healthy', {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
      }),
    );
  });

  // ── API Routes ─────────────────────────────────────────────────────────────
  app.use('/api/v1/products', productsRouter);

  // ── 404 Handler ───────────────────────────────────────────────────────────
  app.use((_req: Request, res: Response) => {
    res
      .status(HTTP_STATUS.NOT_FOUND)
      .json({ success: false, message: 'Route not found' });
  });

  // ── Central Error Handling Middleware (must be last) ───────────────────────
  app.use(errorMiddleware);

  return app;
};

export default createApp;
