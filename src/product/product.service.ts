import { Injectable } from '@nestjs/common';
import { EntityManager, FindOneOptions } from 'typeorm';
import { Product } from './entity/product.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { MercadoLibreProductService } from 'src/mercado-libre/mercado-libre-product.service';
import type { User } from 'src/user/entity/user.entity';
import { MercadoLibreProductAdapter } from './adapter/mercado-libre-product.adapter';
import type { IdMl } from './type/id-ml.type';

@Injectable()
export class ProductService {
  private readonly productRelations: FindOneOptions<Product>['relations'] = {
    images: true,
    favorites: true,
  };

  constructor(
    private readonly mercadoLibreProductService: MercadoLibreProductService,
    private readonly transactionService: TransactionService,
  ) {}

  async search(q: string, user: User, manager?: EntityManager): Promise<Array<Product>> {
    return await this.transactionService.transaction(async (manager) => {
      const adapter = await this.searchAdapter(q, user);
      const savedProducts = await this.findProductsByIdsMl(adapter.ids, this.productRelations, manager);
      return adapter.products(savedProducts);
    }, manager);
  }

  async product(idMl: string, user: User, manager?: EntityManager): Promise<Product> {
    return await this.transactionService.transaction(async (manager) => {
      const adapter = new MercadoLibreProductAdapter(
        [await this.mercadoLibreProductService.getProduct(idMl)],
        user,
      );
      const product = await this.findProductByIdMl(idMl, this.productRelations, manager);
      return adapter.products(product ? [product] : [])[0];
    }, manager);
  }

  async getOrCreateProduct(
    idMl: string,
    relations: FindOneOptions<Product>['relations'],
    manager?: EntityManager,
  ): Promise<Product> {
    return await this.transactionService.transaction(async (manager) => {
      let product = await this.findProductByIdMl(idMl, relations, manager);
      product ??= await this.createProduct(idMl, manager);
      return product;
    }, manager);
  }

  async createProduct(idMl: string, manager: EntityManager): Promise<Product> {
    return await this.transactionService.transaction(async (manager) => {
      const mercadoLibreProduct = await this.mercadoLibreProductService.getProduct(idMl);
      return await manager.save(mercadoLibreProduct.product);
    }, manager);
  }

  async findProductByIdMl(
    idMl: string,
    relations?: FindOneOptions<Product>['relations'],
    manager?: EntityManager,
  ): Promise<Product | null> {
    return await this.transactionService.transaction(async (manager) => {
      return await manager.findOne(Product, { where: { idMl }, relations });
    }, manager);
  }

  async findProductsByIdsMl(
    ids: Array<IdMl>,
    relations?: FindOneOptions<Product>['relations'],
    manager?: EntityManager,
  ): Promise<Array<Product>> {
    return await this.transactionService.transaction(async (manager) => {
      return ids.length > 0 ? await manager.find(Product, { where: ids, relations }) : [];
    }, manager);
  }

  async findProductsByIds(
    ids: Array<{ id: string }>,
    relations?: FindOneOptions<Product>['relations'],
    manager?: EntityManager,
  ): Promise<Array<Product>> {
    return await this.transactionService.transaction(async (manager) => {
      return ids.length > 0 ? await manager.find(Product, { where: ids, relations }) : [];
    }, manager);
  }

  private async searchAdapter(q: string, user: User): Promise<MercadoLibreProductAdapter> {
    const { results } = await this.mercadoLibreProductService.search(q);
    return new MercadoLibreProductAdapter(results, user);
  }
}
