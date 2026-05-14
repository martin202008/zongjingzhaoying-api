import { Controller, Get, Post, Put, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll(
    @Query('level') level?: string,
    @Query('status') status?: string,
    @Query('brand_name') brandName?: string,
  ) {
    return this.customerService.findAll({ level, status, brandName });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.customerService.create(data);
  }

  @Post('update')
  async update(@Body() data: { id: number; [key: string]: any }) {
    return this.customerService.update(data.id, data);
  }
}