import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { MercadoLibreProductAttribute } from './mercado-libre-product-atribute.entity';
import { MercadoLibreProduct } from './mercado-libre-product.entity';
import { MercadoLibreSearchResultPaging } from './mercado-libre-search-result-paging.entity';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MercadoLibreSearchResult {
  @ApiProperty()
  keywords: string;
  @ApiProperty()
  paging: MercadoLibreSearchResultPaging;
  @ApiProperty({ type: MercadoLibreProduct, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => MercadoLibreProduct)
  results: Array<MercadoLibreProduct>;
  @ApiProperty({ type: MercadoLibreProductAttribute, isArray: true })
  used_attributes: Array<MercadoLibreProductAttribute>;
  @ApiProperty()
  query_type: string;
}
