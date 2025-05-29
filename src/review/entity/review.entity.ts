import { Column } from 'typeorm';

export class Review {
  @Column({ nullable: true })
  rate: number;
  @Column({ nullable: true })
  comment: string;
  @Column({ default: false })
  reviewed: boolean;
}
