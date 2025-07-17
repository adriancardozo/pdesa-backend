import { Review } from 'src/review/entity/review.entity';
import { Reviewable } from 'src/review/type/reviewable.type';
import { Favorite } from 'src/favorite/entity/favorite.entity';
import { mock } from 'test/resources/mocks/mock';

describe('Review', () => {
  let review: Review;
  let reviewable: jest.Mocked<Reviewable>;

  beforeEach(() => {
    review = new Review();
    review.update({ rate: 3, comment: 'Awesome' });
    reviewable = mock(Favorite);
  });

  describe('Set reviewable', () => {
    it('should set reviewable', () => {
      review.setReviewable(reviewable);
      expect(review.reviewable).toEqual(reviewable);
    });
  });

  describe('Delete', () => {
    it('should unset rate', () => {
      review.delete();
      expect(review.rate).toBeNull();
    });

    it('should unset comment', () => {
      review.delete();
      expect(review.comment).toBeNull();
    });

    it('should set reviewed to false', () => {
      review.delete();
      expect(review.reviewed).toBeFalsy();
    });

    it('should return review', () => {
      const result = review.delete();
      expect(result).toEqual(review);
    });
  });

  describe('Update', () => {
    describe('Reviewed', () => {
      const rate = 6;
      const comment = 'New comment';

      it('should set rate', () => {
        review.update({ rate });
        expect(review.rate).toEqual(rate);
      });

      it('should set comment', () => {
        review.update({ comment });
        expect(review.comment).toEqual(comment);
      });

      it('should return review', () => {
        const result = review.update({ rate, comment });
        expect(result).toEqual(review);
      });
    });

    describe('Not reviewed', () => {
      const rate = 6;
      const comment = 'New comment';

      beforeEach(() => {
        review.delete();
      });

      it('should set rate', () => {
        review.update({ rate });
        expect(review.rate).toEqual(rate);
      });

      it('should set comment', () => {
        review.update({ comment });
        expect(review.comment).toEqual(comment);
      });

      it('should set reviewed', () => {
        review.update({ rate, comment });
        expect(review.reviewed).toBeTruthy();
      });

      it('should not be reviewed', () => {
        review.update({});
        expect(review.reviewed).toBeFalsy();
      });

      it('should return review', () => {
        const result = review.update({ rate, comment });
        expect(result).toEqual(review);
      });
    });
  });
});
