import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from '../grades/entities/grade.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { CollectionItem } from './entities/collection-item.entity';
import { LeafCollection } from './entities/leaf-collection.entity';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeafCollection, CollectionItem, Supplier, Grade]),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService, TypeOrmModule],
})
export class CollectionsModule {}
