import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { CollectionItem } from './collection-item.entity';

@Entity({ name: 'Collections' })
export class LeafCollection {
  @PrimaryGeneratedColumn({ name: 'collectionId' })
  collectionId!: number;

  @Column({ name: 'supplierId' })
  supplierId!: number;

  @Column({ type: 'date' })
  collectionDate!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalWeight!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  qualityScore!: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.collections, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'supplierId', referencedColumnName: 'supplierId' })
  supplier!: Supplier;

  @OneToMany(() => CollectionItem, (item) => item.collection, {
    cascade: true,
  })
  items!: CollectionItem[];
}
