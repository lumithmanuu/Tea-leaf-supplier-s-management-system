import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CollectionsModule } from './collections/collections.module';
import { databaseConfig } from './database/database.config';
import { GradesModule } from './grades/grades.module';
import { ReportsModule } from './reports/reports.module';
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    SuppliersModule,
    GradesModule,
    CollectionsModule,
    ReportsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
