import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboardSummary() {
    return this.reportsService.getDashboardSummary();
  }

  @Get('supplier-ranking')
  getSupplierRanking() {
    return this.reportsService.getSupplierRanking();
  }

  @Get('grade-wise')
  getGradeWiseCollection() {
    return this.reportsService.getGradeWiseCollection();
  }
}
