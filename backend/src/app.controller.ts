import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      message: 'Tea Leaf Supplier Quality and Payment Management API',
      status: 'ok',
    };
  }
}
