import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { HTTP_STATUS } from '../constants/http-status.constants';
import { ApiErrorResponse } from '../utils/api-response.util';
import { FieldError } from '../types';
import { logger } from '../logger/logger';

type ValidateTarget = 'body' | 'query' | 'params';

/**
 * Zod validation middleware factory.
 * Validates the specified part of the request against the given Zod schema.
 * On failure, returns a 422 ApiErrorResponse with per-field errors.
 *
 * @param schema  - The Zod schema to validate against
 * @param target  - Which part of req to validate: 'body' | 'query' | 'params'
 */
export const validate = (
  schema: ZodSchema,
  target: ValidateTarget = 'body',
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const zodError = result.error as ZodError;
      const fieldErrors: FieldError[] = zodError.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      logger.warn('Validation failed', { target, errors: fieldErrors });

      res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .json(new ApiErrorResponse('Validation failed', fieldErrors));
      return;
    }

    // Replace request target with the parsed (and potentially transformed) data
    req[target] = result.data;
    next();
  };
};
