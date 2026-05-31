import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CollectionItem } from './collections/entities/collection-item.entity';
import { LeafCollection } from './collections/entities/leaf-collection.entity';
import { CollectionsModule } from './collections/collections.module';
import { databaseConfig, ensureDatabaseExists } from './database/database.config';
import { SampleDataService } from './database/sample-data.service';
import { Grade } from './grades/entities/grade.entity';
import { GradesModule } from './grades/grades.module';
import { ReportsModule } from './reports/reports.module';
import { Supplier } from './suppliers/entities/supplier.entity';
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        await ensureDatabaseExists();
        return databaseConfig;
      },
    }),
    TypeOrmModule.forFeature([Supplier, Grade, LeafCollection, CollectionItem]),
    AuthModule,
    SuppliersModule,
    GradesModule,
    CollectionsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [SampleDataService],
})
export class AppModule {}
