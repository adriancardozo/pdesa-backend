import type { Product } from 'src/product/entity/product.entity';
import type { Review } from '../entity/review.entity';
import { ReviewType } from '../enum/review-type.enum';
import type { User } from 'src/user/entity/user.entity';

export interface Reviewable {
  id: string;
  idMl: string;
  reviewType: ReviewType;
  product: Product;
  user: User;

  get reviewed(): boolean;

  getReview(): Review;
}
