import { Favorite } from 'src/favorite/entity/favorite.entity';
import { Image } from 'src/image/entity/image.entity';
import { Product } from 'src/product/entity/product.entity';
import { Purchase } from 'src/purchase/entity/purchase.entity';
import { User } from 'src/user/entity/user.entity';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

const entities = [User, Product, Image, Purchase, Favorite];

export const DATA_SOURCE_OPTIONS: SqliteConnectionOptions = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  logging: false,
  entities,
};
