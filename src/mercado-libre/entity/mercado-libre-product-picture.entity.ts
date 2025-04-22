import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Image } from 'src/image/entity/image.entity';

export class MercadoLibreProductPicture {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsUrl()
  @IsNotEmpty()
  url: string;

  get image(): Image {
    return new Image(this.id, this.url);
  }
}
