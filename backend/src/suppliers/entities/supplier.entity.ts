import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LeafCollection } from '../../collections/entities/leaf-collection.entity';

@Entity({ name: 'Suppliers' })
export class Supplier {
  @PrimaryGeneratedColumn({ name: 'supplierId' })
  supplierId!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'Active' })
  status!: string;

  @CreateDateColumn({
    name: 'registeredDate',
    type: 'datetime',
    default: () => 'GETDATE()',
  })
  registeredDate!: Date;

  @OneToMany(() => LeafCollection, (collection) => collection.supplier)
  collections!: LeafCollection[];
}
