import { Router } from 'express';
import {
  listProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
} from './products.controller';
import { validate } from '../../middlewares/validate.middleware';
import { createProductSchema } from './dto/create-product.dto';
import { updateProductSchema } from './dto/update-product.dto';

const router = Router();

// GET  /api/v1/products
router.get('/', listProducts);

// POST /api/v1/products
router.post('/', validate(createProductSchema), addProduct);

// GET  /api/v1/products/:id
router.get('/:id', getProduct);

// PATCH /api/v1/products/:id
router.patch('/:id', validate(updateProductSchema), editProduct);

// DELETE /api/v1/products/:id
router.delete('/:id', removeProduct);

export default router;
