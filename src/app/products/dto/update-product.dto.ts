import { z } from 'zod';

export const updateProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name cannot be empty')
      .max(255, 'Name cannot exceed 255 characters')
      .optional(),

    description: z
      .string()
      .trim()
      .max(2000, 'Description cannot exceed 2000 characters')
      .nullable()
      .optional(),

    price: z
      .number()
      .positive('Price must be a positive number')
      .multipleOf(0.01, 'Price can have at most 2 decimal places')
      .optional(),

    stock: z
      .number()
      .int('Stock must be an integer')
      .min(0, 'Stock cannot be negative')
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided for update',
  );

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
