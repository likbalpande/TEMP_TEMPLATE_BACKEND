import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.util';
import { ApiErrorResponse } from '../utils/api-response.util';
import { HTTP_STATUS } from '../constants/http-status.constants';
import { logger } from '../logger/logger';
import { FieldError } from '../types';

/**
 * Central Express error handling middleware.
 * Must be registered LAST in app.ts (after all routes).
 *
 * Handles:
 *  - AppError subclasses (operational errors)
 *  - ZodError (schema validation errors)
 *  - Unknown/unexpected errors
 */
export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  // --- Operational AppErrors ---
  if (err instanceof AppError) {
    logger.error(`AppError: ${err.message}`, {
      statusCode: err.statusCode,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    res
      .status(err.statusCode)
      .json(new ApiErrorResponse(err.message));
    return;
  }

  // --- Zod Validation Errors (thrown manually, not via middleware) ---
  if (err instanceof ZodError) {
    const fieldErrors: FieldError[] = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    logger.warn('ZodError in error handler', { errors: fieldErrors });

    res
      .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      .json(new ApiErrorResponse('Validation failed', fieldErrors));
    return;
  }

  // --- Unknown/Unexpected Errors ---
  const message =
    err instanceof Error ? err.message : 'An unexpected error occurred';
  const stack = err instanceof Error ? err.stack : undefined;

  logger.error('Unhandled error', {
    message,
    stack,
    path: req.path,
    method: req.method,
  });

  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json(new ApiErrorResponse('Internal server error'));
};
