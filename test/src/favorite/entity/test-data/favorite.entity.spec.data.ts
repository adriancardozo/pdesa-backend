import { Product } from 'src/product/entity/product.entity';
import configuration from 'src/config/configuration';
import { ReviewData } from 'src/review/type/review-data.type';

export const errors = configuration().error.message;

export const product = { idMl: 'ML123456' } as Product;

export const reviewData = { rate: 3, comment: 'Awesome' } as ReviewData;
