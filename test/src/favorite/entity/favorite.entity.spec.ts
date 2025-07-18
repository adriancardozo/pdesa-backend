import { Favorite } from 'src/favorite/entity/favorite.entity';
import { errors, product, reviewData } from './test-data/favorite.entity.spec.data';
import { BadRequestException } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { mock } from 'test/resources/mocks/mock';
import { ReviewType } from 'src/review/enum/review-type.enum';
import { Review } from 'src/review/entity/review.entity';

describe('Favorite', () => {
  let favorite: Favorite;
  let favoriteWithoutQueryUser: Favorite;
  let user: jest.Mocked<User>;
  let review: jest.Mocked<Review>;

  beforeEach(() => {
    user = mock(User);
    review = mock(Review);
    favorite = new Favorite(user, product);
    favorite.setQueryUser(user);
    favoriteWithoutQueryUser = new Favorite(user, product);
  });

  describe('Id ML', () => {
    it('should return Mercado Libre product id', () => {
      expect(favorite.idMl).toEqual(product.idMl);
    });
  });

  describe('Is favorite', () => {
    it('should fail if query user is not setted', () => {
      expect(() => favoriteWithoutQueryUser.isFavorite).toThrow(
        new BadRequestException(errors.notQueryUser),
      );
    });

    it("should return true if it is query user's favorite", () => {
      user.favorites = [favorite];
      const result = favorite.isFavorite;
      expect(result).toBeTruthy();
    });

    it("should return false if it isn't query user's favorite", () => {
      user.favorites = [];
      const result = favorite.isFavorite;
      expect(result).toBeFalsy();
    });

    it("should return false if user hasn't favorites", () => {
      user.favorites = undefined as never as Array<Favorite>;
      const result = favorite.isFavorite;
      expect(result).toBeFalsy();
    });
  });

  describe('Set query user', () => {
    it('should set query user', () => {
      favoriteWithoutQueryUser.setQueryUser(user);
      expect(favoriteWithoutQueryUser.queryUser).toEqual(user);
    });
  });

  describe('Review type', () => {
    it('should return favorite review type', () => {
      const result = favorite.reviewType;
      expect(result).toEqual(ReviewType.favorite);
    });
  });

  describe('Reviewed', () => {
    let reviewed: boolean;

    beforeEach(() => {
      reviewed = jest.fn() as any as boolean;
      review.reviewed = reviewed;
      favorite.review = review;
    });

    it('should return favorite review type', () => {
      const result = favorite.reviewed;
      expect(result).toEqual(reviewed);
    });
  });

  describe('Update review', () => {
    beforeEach(() => {
      favorite.review = review;
      review.update.mockReturnValue(review);
    });

    it('should update review', () => {
      favorite.updateReview(reviewData);
      expect(review.update).toHaveBeenCalledWith(reviewData);
    });

    it('should return favorite review', () => {
      const result = favorite.updateReview(reviewData);
      expect(result).toEqual(review);
    });
  });

  describe('Delete review', () => {
    beforeEach(() => {
      favorite.review = review;
      review.delete.mockReturnValue(review);
    });

    it('should delete review', () => {
      favorite.deleteReview();
      expect(review.delete).toHaveBeenCalledWith();
    });

    it('should return favorite review', () => {
      const result = favorite.deleteReview();
      expect(result).toEqual(review);
    });
  });

  describe('Set reviewable', () => {
    beforeEach(() => {
      favorite.review = review;
    });

    it('should set reviewable', () => {
      favorite.setReviewable();
      expect(review.setReviewable).toHaveBeenCalledWith(favorite);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
