import { Product } from 'src/product/entity/product.entity';
import { mock } from 'test/resources/mocks/mock';
import { User } from 'src/user/entity/user.entity';
import { Purchase } from 'src/purchase/entity/purchase.entity';
import { idMl, reviewData } from './test-data/purchase.entity.spec.data';
import { ReviewType } from 'src/review/enum/review-type.enum';
import { Review } from 'src/review/entity/review.entity';

describe('Purchase', () => {
  let purchase: Purchase;
  let user: jest.Mocked<User>;
  let product: jest.Mocked<Product>;
  let review: jest.Mocked<Review>;
  const amount = 2;
  const price = 30;

  beforeEach(() => {
    user = mock(User);
    product = mock(Product);
    review = mock(Review);
    product.price = price;
    purchase = new Purchase(amount, user, product);
  });

  describe('Final price', () => {
    it('should return final price', () => {
      const result = purchase.finalPrice;
      expect(result).toEqual(amount * product.price);
    });
  });

  describe('Set query user', () => {
    it('should set product query user', () => {
      purchase.setQueryUser(user);
      expect(product.setQueryUser).toHaveBeenCalledWith(user);
    });

    it('should return purchase', () => {
      const result = purchase.setQueryUser(user);
      expect(result).toEqual(purchase);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('Id ML', () => {
    beforeEach(() => {
      product.idMl = idMl;
    });

    it('should return product ML id', () => {
      const result = purchase.idMl;
      expect(result).toEqual(product.idMl);
    });
  });

  describe('Review type', () => {
    it('should return purchase review type', () => {
      const result = purchase.reviewType;
      expect(result).toEqual(ReviewType.purchase);
    });
  });

  describe('Reviewed', () => {
    let reviewed: boolean;

    beforeEach(() => {
      reviewed = jest.fn() as any as boolean;
      purchase.review = review;
      review.reviewed = reviewed;
    });

    it('should return reviewed', () => {
      const result = purchase.reviewed;
      expect(result).toEqual(reviewed);
    });
  });

  describe('Update review', () => {
    beforeEach(() => {
      purchase.review = review;
      review.update.mockReturnValue(review);
    });

    it('should update review', () => {
      purchase.updateReview(reviewData);
      expect(review.update).toHaveBeenCalledWith(reviewData);
    });

    it('should return updated review', () => {
      const result = purchase.updateReview(reviewData);
      expect(result).toEqual(review);
    });
  });

  describe('Delete review', () => {
    beforeEach(() => {
      purchase.review = review;
      review.delete.mockReturnValue(review);
    });

    it('should delete review', () => {
      purchase.deleteReview();
      expect(review.delete).toHaveBeenCalledWith();
    });

    it('should return deleted review', () => {
      const result = purchase.deleteReview();
      expect(result).toEqual(review);
    });
  });

  describe('Set reviewable', () => {
    beforeEach(() => {
      purchase.review = review;
    });

    it('should set reviewable', () => {
      purchase.setReviewable();
      expect(review.setReviewable).toHaveBeenCalledWith(purchase);
    });
  });
});
