import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ModelEntity } from './model-entity';

export class BaseEntity extends ModelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
  @DeleteDateColumn({ type: 'datetime' })
  deletedAt: Date;
}
