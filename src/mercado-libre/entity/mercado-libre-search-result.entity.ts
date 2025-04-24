import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { MercadoLibreProductAttribute } from './mercado-libre-product-atribute.entity';
import { MercadoLibreProduct } from './mercado-libre-product.entity';
import { MercadoLibreSearchResultPaging } from './mercado-libre-search-result-paging.entity';
import { Type } from 'class-transformer';

export class MercadoLibreSearchResult {
  keywords: string;
  paging: MercadoLibreSearchResultPaging;
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => MercadoLibreProduct)
  results: Array<MercadoLibreProduct>;
  used_attributes: Array<MercadoLibreProductAttribute>;
  query_type: string;
}
