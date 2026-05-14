import { Controller, Get, Post, Put, Delete, Body, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ShopService } from './shop.service';

@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  async findAll(@Query('project_id') projectId?: string) {
    return this.shopService.findAll(projectId ? parseInt(projectId) : undefined);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shopService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.shopService.create(data);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.shopService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.shopService.delete(id);
  }
}