import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MercadoLibreProductAttribute {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  value_id?: string;
  @IsString()
  @IsOptional()
  value_name?: string;
}
