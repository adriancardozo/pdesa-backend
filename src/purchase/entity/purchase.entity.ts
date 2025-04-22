import type { Product } from 'src/product/entity/product.entity';

export class Purchase {
  id: string;
  price: number;
  amount: number;
  product: Product;
}
