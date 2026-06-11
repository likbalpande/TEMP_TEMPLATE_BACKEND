import { Request } from 'express';

/** Generic paginated query parameters */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

/** Extended Request type that carries an authenticated user payload */
export interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/** Shape of a Zod field error used in API error responses */
export interface FieldError {
  field: string;
  message: string;
}
