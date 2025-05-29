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
import { CONFIG_SERVICE } from 'src/shared/config/config.service';
import { Configuration } from 'src/config/configuration';
import { ApiProperty } from '@nestjs/swagger';

const errors: Configuration['error']['message'] = CONFIG_SERVICE.get('error.message')!;

export class MercadoLibreProduct {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date_created: Date;
  @ApiProperty()
  @IsString()
  @IsOptional()
  keywords?: string;
  @ApiProperty({ type: MercadoLibreProductAttribute, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => MercadoLibreProductAttribute)
  attributes: Array<MercadoLibreProductAttribute>;
  @ApiProperty({ type: MercadoLibreProductPicture, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => MercadoLibreProductPicture)
  pictures: Array<MercadoLibreProductPicture>;
  @ApiProperty({ enum: ['active', 'inactive'] })
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
    if (!this.active()) throw new NotFoundException(errors.mlProductInactive);
    return new Product(
      this.id,
      this.name,
      new Date(this.date_created),
      this.description ?? '',
      this.keywords ?? '',
      this.pictures.map((picture) => picture.image),
    );
  }

  active(): boolean {
    return this.status === 'active';
  }
}
