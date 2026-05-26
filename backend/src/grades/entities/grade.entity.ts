import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CollectionItem } from '../../collections/entities/collection-item.entity';

@Entity({ name: 'Grades' })
export class Grade {
  @PrimaryGeneratedColumn({ name: 'gradeId' })
  gradeId!: number;

  @Column({ type: 'varchar', length: 50 })
  gradeName!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  ratePerKg!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @OneToMany(() => CollectionItem, (item) => item.grade)
  collectionItems!: CollectionItem[];
}
