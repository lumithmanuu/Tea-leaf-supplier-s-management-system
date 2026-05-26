import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grade } from '../../grades/entities/grade.entity';
import { LeafCollection } from './leaf-collection.entity';

@Entity({ name: 'CollectionItems' })
export class CollectionItem {
  @PrimaryGeneratedColumn({ name: 'itemId' })
  itemId!: number;

  @Column({ name: 'collectionId' })
  collectionId!: number;

  @Column({ name: 'gradeId' })
  gradeId!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weightKg!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  ratePerKg!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @ManyToOne(() => LeafCollection, (collection) => collection.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'collectionId', referencedColumnName: 'collectionId' })
  collection!: LeafCollection;

  @ManyToOne(() => Grade, (grade) => grade.collectionItems, {
    eager: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'gradeId', referencedColumnName: 'gradeId' })
  grade!: Grade;
}
