import { Product } from 'src/product/entity/product.entity';
import { User } from 'src/user/entity/user.entity';
import { FindOneOptions } from 'typeorm';

export const products = [
  {
    id: '1',
    setQueryUser(user) {
      return this;
    },
  },
  {
    id: '2',
    setQueryUser(user) {
      return this;
    },
  },
  {
    id: '3',
    setQueryUser(user) {
      return this;
    },
  },
] as Array<Product>;

export const productIds = products.map((product) => ({ id: product.id }));

export const productRelations: FindOneOptions<Product>['relations'] = {
  images: true,
  favorites: true,
  purchases: true,
};

export const userRelations: FindOneOptions<User>['relations'] = { purchases: true };

export const users = [
  {
    id: '1',
    setQueryUser(user) {
      return this;
    },
  },
  {
    id: '2',
    setQueryUser(user) {
      return this;
    },
  },
  {
    id: '3',
    setQueryUser(user) {
      return this;
    },
  },
] as Array<User>;

export const userIds = users.map((user) => ({ id: user.id }));
