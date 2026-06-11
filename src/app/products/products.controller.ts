import { Request, Response } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiSuccessResponse } from '../../utils/api-response.util';
import { asyncHandler } from '../../utils/async-handler.util';
import { HTTP_STATUS } from '../../constants/http-status.constants';
import { logger } from '../../logger/logger';

const CONTROLLER = 'ProductsController';

export const listProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    logger.info(`[${CONTROLLER}] listProducts — entry`);

    const data = await getAllProducts();

    logger.info(`[${CONTROLLER}] listProducts — exit`, { count: data.length });
    res
      .status(HTTP_STATUS.OK)
      .json(new ApiSuccessResponse('Products retrieved successfully', data));
  },
);

export const getProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    logger.info(`[${CONTROLLER}] getProduct — entry`, { id });

    const data = await getProductById(id);

    logger.info(`[${CONTROLLER}] getProduct — exit`, { id });
    res
      .status(HTTP_STATUS.OK)
      .json(new ApiSuccessResponse('Product retrieved successfully', data));
  },
);

export const addProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    logger.info(`[${CONTROLLER}] addProduct — entry`);

    const dto = req.body as CreateProductDto;
    const data = await createProduct(dto);

    logger.info(`[${CONTROLLER}] addProduct — exit`, { id: data.id });
    res
      .status(HTTP_STATUS.CREATED)
      .json(new ApiSuccessResponse('Product created successfully', data));
  },
);

export const editProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    logger.info(`[${CONTROLLER}] editProduct — entry`, { id });

    const dto = req.body as UpdateProductDto;
    const data = await updateProduct(id, dto);

    logger.info(`[${CONTROLLER}] editProduct — exit`, { id });
    res
      .status(HTTP_STATUS.OK)
      .json(new ApiSuccessResponse('Product updated successfully', data));
  },
);

export const removeProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    logger.info(`[${CONTROLLER}] removeProduct — entry`, { id });

    await deleteProduct(id);

    logger.info(`[${CONTROLLER}] removeProduct — exit`, { id });
    res
      .status(HTTP_STATUS.OK)
      .json(new ApiSuccessResponse('Product deleted successfully', {}));
  },
);
