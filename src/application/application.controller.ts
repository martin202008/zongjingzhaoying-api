import { Controller, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApplicationService } from './application.service';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  async create(@Body() data: { brandName: string; contactName: string; phone: string; projectId?: number; intentionArea?: string; intentionCity?: string }) {
    return this.applicationService.create(data);
  }

  @Get()
  async findAll() {
    return this.applicationService.findAll();
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: { status?: string; remark?: string }) {
    return this.applicationService.update(id, data);
  }
}
