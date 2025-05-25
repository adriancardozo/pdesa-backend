import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Image } from 'src/image/entity/image.entity';

export class MercadoLibreProductPicture {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  url: string;

  get image(): Image {
    return new Image(this.id, this.url);
  }
}
