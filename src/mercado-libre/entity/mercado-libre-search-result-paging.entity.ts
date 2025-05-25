import { ApiProperty } from '@nestjs/swagger';

export class MercadoLibreSearchResultPaging {
  @ApiProperty()
  total: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  offset: number;
}
