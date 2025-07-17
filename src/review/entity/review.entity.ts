import { Column } from 'typeorm';
import type { Reviewable } from '../type/reviewable.type';
import type { ReviewData } from '../type/review-data.type';

export class Review {
  @Column({ nullable: true })
  rate: number;
  @Column({ nullable: true })
  comment: string;
  @Column({ default: false })
  reviewed: boolean;

  reviewable: Reviewable;

  update(data: ReviewData): Review {
    const reviewed = !this.emptyData(data);
    this.reviewed = this.reviewed || reviewed;
    if (this.reviewed) {
      this.rate = data.rate ?? this.rate;
      this.comment = data.comment ?? this.comment;
    }
    return this;
  }

  delete(): Review {
    this.rate = null as any;
    this.comment = null as any;
    this.reviewed = false;
    return this;
  }

  setReviewable(reviewable: Reviewable) {
    this.reviewable = reviewable;
  }

  private emptyData({ rate, comment }: ReviewData): boolean {
    return !rate && rate !== 0 && !comment && comment !== '';
  }
}
