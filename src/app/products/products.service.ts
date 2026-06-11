import { eq } from 'drizzle-orm';
import { db } from '../../config/database.config';
import { products, Product, NewProduct } from './products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundError } from '../../utils/errors.util';
import { logger } from '../../logger/logger';

const SERVICE = 'ProductsService';

export const getAllProducts = async (): Promise<Product[]> => {
  logger.info(`[${SERVICE}] getAllProducts — entry`);

  const result = await db.select().from(products).orderBy(products.createdAt);

  logger.info(`[${SERVICE}] getAllProducts — exit`, { count: result.length });
  return result;
};

export const getProductById = async (id: string): Promise<Product> => {
  logger.info(`[${SERVICE}] getProductById — entry`, { id });

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!product) {
    logger.warn(`[${SERVICE}] getProductById — not found`, { id });
    throw new NotFoundError(`Product with id '${id}' not found`);
  }

  logger.info(`[${SERVICE}] getProductById — exit`, { id });
  return product;
};

export const createProduct = async (
  dto: CreateProductDto,
): Promise<Product> => {
  logger.info(`[${SERVICE}] createProduct — entry`, { name: dto.name });

  const newProduct: NewProduct = {
    ...dto,
    price: String(dto.price),
  };

  const [created] = await db.insert(products).values(newProduct).returning();

  logger.info(`[${SERVICE}] createProduct — exit`, { id: created.id });
  return created;
};

export const updateProduct = async (
  id: string,
  dto: UpdateProductDto,
): Promise<Product> => {
  logger.info(`[${SERVICE}] updateProduct — entry`, { id });

  // Ensure the product exists first
  await getProductById(id);

  const { price, ...rest } = dto;

  const updateValues: Partial<NewProduct> = {
    ...rest,
    ...(price !== undefined && { price: String(price) }),
    updatedAt: new Date(),
  };

  const [updated] = await db
    .update(products)
    .set(updateValues)
    .where(eq(products.id, id))
    .returning();

  logger.info(`[${SERVICE}] updateProduct — exit`, { id });
  return updated;
};

export const deleteProduct = async (id: string): Promise<void> => {
  logger.info(`[${SERVICE}] deleteProduct — entry`, { id });

  // Ensure the product exists first
  await getProductById(id);

  await db.delete(products).where(eq(products.id, id));

  logger.info(`[${SERVICE}] deleteProduct — exit`, { id });
};
