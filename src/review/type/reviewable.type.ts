import type { Product } from 'src/product/entity/product.entity';
import { ReviewType } from '../enum/review-type.enum';
import type { User } from 'src/user/entity/user.entity';
import type { ReviewData } from './review-data.type';
import { Review } from '../entity/review.entity';

export interface Reviewable {
  id: string;
  idMl: string;
  reviewType: ReviewType;
  product: Product;
  user: User;

  get reviewed(): boolean;

  updateReview(data: ReviewData): Review;

  deleteReview(): Review;
}
