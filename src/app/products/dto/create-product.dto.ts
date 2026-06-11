import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(1, 'Name cannot be empty')
    .max(255, 'Name cannot exceed 255 characters'),

  description: z
    .string()
    .trim()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),

  price: z
    .number({ required_error: 'Price is required' })
    .positive('Price must be a positive number')
    .multipleOf(0.01, 'Price can have at most 2 decimal places'),

  stock: z
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .default(0),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
