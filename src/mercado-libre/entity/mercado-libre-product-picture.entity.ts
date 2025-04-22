import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class MercadoLibreProductPicture {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
