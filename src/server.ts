import 'dotenv/config';
import { env } from './config/env.config';
import { logger } from './logger/logger';
import { db } from './config/database.config';
import { sql } from 'drizzle-orm';
import createApp from './app';

const bootstrap = async (): Promise<void> => {
  // ── Verify Database Connection ─────────────────────────────────────────────
  logger.info('Connecting to database...');
  try {
    await db.execute(sql`SELECT 1`);
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Failed to connect to database', { error });
    process.exit(1);
  }

  // ── Start Express Server ───────────────────────────────────────────────────
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running`, {
      port: env.PORT,
      environment: env.NODE_ENV,
      health: `http://localhost:${env.PORT}/health`,
      api: `http://localhost:${env.PORT}/api/v1`,
    });
  });

  // ── Graceful Shutdown ──────────────────────────────────────────────────────
  const shutdown = (signal: string): void => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught exception', { error: error.message, stack: error.stack });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled rejection', { reason });
    process.exit(1);
  });
};

bootstrap();
