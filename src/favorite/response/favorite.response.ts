import { Response } from 'src/shared/responses/response';
import { Favorite } from '../entity/favorite.entity';
import { ResponseMapper } from 'src/shared/mappers/response.mapper';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewResponse } from 'src/review/response/review.response';

export class FavoriteResponse extends Response<Favorite> {
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
  @ApiProperty({ type: 'string', isArray: true })
  images: Array<string>;
  @ApiProperty({ type: ReviewResponse })
  review: ReviewResponse;

  constructor(favorite: Favorite, mapper: ResponseMapper) {
    super(favorite, mapper);
    this.ml_id = favorite.idMl;
    this.name = favorite.product.name;
    this.description = favorite.product.description;
    this.ml_created_at = favorite.product.mlCreatedAt.toISOString();
    this.images = favorite.product.images.map((image) => image.url);
    this.is_favorite = favorite.isFavorite;
    favorite.setReviewable();
    this.review = mapper.map(favorite.review, ReviewResponse);
  }
}
