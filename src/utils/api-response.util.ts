import { FieldError } from '../types';

/**
 * Standard success response shape.
 * { success: true, message: "...", data: {...} }
 */
export class ApiSuccessResponse<T = unknown> {
  public readonly success = true;
  public readonly message: string;
  public readonly data: T;

  constructor(message: string, data: T) {
    this.message = message;
    this.data = data;
  }
}

/**
 * Standard error response shape.
 * { success: false, message: "...", errors?: [...] }
 */
export class ApiErrorResponse {
  public readonly success = false;
  public readonly message: string;
  public readonly errors?: FieldError[];

  constructor(message: string, errors?: FieldError[]) {
    this.message = message;
    if (errors && errors.length > 0) {
      this.errors = errors;
    }
  }
}
