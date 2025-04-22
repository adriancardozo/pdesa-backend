import type { Product } from 'src/product/entity/product.entity';
import type { User } from 'src/user/entity/user.entity';

export class Favorite {
  id: string;
  rate: number;
  comment: string;
  userId: string;
  productId: string;
  user: User;
  product: Product;
}
