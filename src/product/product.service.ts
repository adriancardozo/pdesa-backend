import { Injectable } from '@nestjs/common';
import { EntityManager, FindOneOptions } from 'typeorm';
import { Product } from './entity/product.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { MercadoLibreProductService } from 'src/mercado-libre/mercado-libre-product.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly mercadoLibreProductService: MercadoLibreProductService,
    private readonly transactionService: TransactionService,
  ) {}

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
}
