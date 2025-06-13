import { Response } from 'src/shared/responses/response';
import { ResponseMapper } from 'src/shared/mappers/response.mapper';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entity/product.entity';

export class ProductResponse extends Response<Product> {
  @ApiProperty()
  ml_id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  ml_created_at: string;
  @ApiProperty()
  is_favorite: boolean;
  @ApiProperty({ isArray: true })
  images: Array<string>;

  constructor(product: Product, mapper: ResponseMapper) {
    super(product, mapper);
    this.ml_id = product.idMl;
    this.name = product.name;
    this.description = product.description;
    this.ml_created_at = product.mlCreatedAt.toISOString();
    this.images = product.images.map((image) => image.url);
    this.is_favorite = product.isFavorite;
  }
}
