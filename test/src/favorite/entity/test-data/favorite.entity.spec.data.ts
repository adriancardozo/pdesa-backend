import { Product } from 'src/product/entity/product.entity';
import configuration from 'src/config/configuration';

export const errors = configuration().error.message;

export const product = { idMl: 'ML123456' } as Product;
