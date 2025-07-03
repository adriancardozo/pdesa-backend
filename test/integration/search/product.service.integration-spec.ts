import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/config/configuration';
import { DATA_SOURCE_OPTIONS } from 'src/config/data-source.options';
import { ProductModule } from 'src/product/product.module';
import { ProductService } from 'src/product/product.service';
import { products, text, userDto } from './test-data/product.service.integration-spec.data';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { MetricsModule } from 'src/metrics/metrics.module';

describe('ProductService', () => {
  let module: TestingModule;
  let service: ProductService;
  let userService: UserService;
  let user: User;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        TypeOrmModule.forRoot(DATA_SOURCE_OPTIONS),
        ProductModule,
        UserModule,
        MetricsModule,
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    userService = module.get<UserService>(UserService);
    user = await userService.create(userDto);
  });

  describe('Search', () => {
    it('should return Mercado Libre products', async () => {
      const result = await service.search(text, user);
      expect(result).toMatchObject(products);
    });
  });

  afterEach(async () => await module.close());
});
