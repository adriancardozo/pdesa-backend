import type { MercadoLibreProduct } from 'src/mercado-libre/entity/mercado-libre-product.entity';
import type { Product } from '../entity/product.entity';
import type { User } from 'src/user/entity/user.entity';
import { IdMl } from '../type/id-ml.type';

export class MercadoLibreProductAdapter {
  constructor(
    private readonly mercadoLibreProducts: Array<MercadoLibreProduct>,
    private readonly user: User,
  ) {}

  get ids(): Array<IdMl> {
    return this.mercadoLibreProducts.map(({ id: idMl }) => ({ idMl }));
  }

  products(productEntities: Array<Product>): Array<Product> {
    const products = this.mercadoLibreProducts.map((product) => this.getProduct(product, productEntities));
    products.forEach((product) => product.setQueryUser(this.user));
    return products;
  }

  private getProduct(mercadoLibreProduct: MercadoLibreProduct, productEntities: Array<Product>): Product {
    const product = productEntities.find((product) => product.idMl === mercadoLibreProduct.id);
    return product ?? mercadoLibreProduct.product;
  }
}
