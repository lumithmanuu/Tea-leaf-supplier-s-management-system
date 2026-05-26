import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeafCollection } from '../collections/entities/leaf-collection.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([LeafCollection])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
