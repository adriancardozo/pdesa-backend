import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MercadoLibreProductAttribute } from './mercado-libre-product-atribute.entity';
import { Type } from 'class-transformer';
import { MercadoLibreProductPicture } from './mercado-libre-product-picture.entity';
import { Product } from 'src/product/entity/product.entity';
import { NotFoundException } from '@nestjs/common';

export class MercadoLibreProduct {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsDateString()
  @IsNotEmpty()
  date_created: Date;
  @IsString()
  @IsNotEmpty()
  keywords: string;
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => MercadoLibreProductAttribute)
  attributes: Array<MercadoLibreProductAttribute>;
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => MercadoLibreProductPicture)
  pictures: Array<MercadoLibreProductPicture>;
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';

  catalog_product_id: string;
  pdp_types: Array<any>;
  domain_id: string;
  settings: { listing_strategy: string; exclusive: boolean };
  main_features: Array<any>;
  children_ids: Array<string>;
  quality_type: string;
  priority: string;
  type: string;
  site_id: string;
  variations: Array<any>;

  get product(): Product {
    if (!this.active()) throw new NotFoundException('Product not exists or is inactive.');
    return new Product(
      this.id,
      this.name,
      new Date(this.date_created),
      this.description ?? '',
      this.keywords,
    );
  }

  active(): boolean {
    return this.status === 'active';
  }
}
