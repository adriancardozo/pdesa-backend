import { UpdateReviewDto } from 'src/review/dto/update-review.dto';
import { ReviewType } from 'src/review/enum/review-type.enum';
import { ReviewParam } from 'src/review/param/review.param';
import { User } from 'src/user/entity/user.entity';
import { FindOneOptions } from 'typeorm';

export const favoriteParam = { id: '1', review_type: ReviewType.favorite } as ReviewParam;

export const purchaseParam = { id: '1', review_type: ReviewType.purchase } as ReviewParam;

export const updateDto = { rate: 3, comment: 'Awesome' } as UpdateReviewDto;

export const userDto = { id: '1' } as User;

export const userRelations: FindOneOptions<User>['relations'] = {
  favorites: { product: { images: true }, user: true },
  purchases: { product: { images: true }, user: true },
};
