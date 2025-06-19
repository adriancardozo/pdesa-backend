import { Column } from 'typeorm';
import { ReviewData } from '../type/review-data.type';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CONFIG_SERVICE } from 'src/shared/config/config.service';
import { Configuration } from 'src/config/configuration';
import type { Reviewable } from '../type/reviewable.type';

const errors = CONFIG_SERVICE.get<Configuration['error']['message']>('error.message')!;

export class Review {
  @Column({ nullable: true })
  rate?: number;
  @Column({ nullable: true })
  comment?: string;
  @Column({ default: false })
  reviewed: boolean;

  reviewable: Reviewable;

  get(checkReviewed: boolean = true): Review {
    if (checkReviewed && !this.reviewed) throw new NotFoundException(errors.reviewNotFound);
    return this;
  }

  update(data: ReviewData): Review {
    if (!this.reviewed && !this.completeData(data)) throw new BadRequestException(errors.firstTimeReview);
    this.rate = data.rate ?? this.rate;
    this.comment = data.comment ?? this.comment;
    this.reviewed = true;
    return this;
  }

  delete(): Review {
    if (!this.reviewed) throw new NotFoundException(errors.reviewNotFound);
    this.rate = null as any;
    this.comment = null as any;
    this.reviewed = false;
    return this;
  }

  setReviewable(reviewable: Reviewable) {
    this.reviewable = reviewable;
  }

  private completeData({ rate, comment }: ReviewData): boolean {
    return (!!rate || rate === 0) && (!!comment || comment === '');
  }
}
