import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { LeadService } from './lead.service';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('project_id') projectId?: string,
    @Query('assigned_to') assignedTo?: string,
    @Query('stage') stage?: string,
  ) {
    return this.leadService.findAll({
      status,
      projectId: projectId ? parseInt(projectId) : undefined,
      assignedTo: assignedTo ? parseInt(assignedTo) : undefined,
      stage,
    });
  }

  @Get('overdue')
  async getOverdue() {
    return this.leadService.findOverdue();
  }

  @Get('stats')
  async getStats() {
    return this.leadService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leadService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.leadService.create(data);
  }

  @Post('assign')
  async assign(@Body() data: { id: number; assigned_to: number }) {
    return this.leadService.assign(data.id, data.assigned_to);
  }

  @Put(':id/status')
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: { status: string }) {
    return this.leadService.updateStatus(id, body.status);
  }

  @Put(':id/stage')
  async updateStage(@Param('id', ParseIntPipe) id: number, @Body() body: { stage: string; next_follow_time?: string }) {
    const nextFollowTime = body.next_follow_time ? new Date(body.next_follow_time) : undefined;
    return this.leadService.updateStage(id, body.stage, nextFollowTime);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.leadService.remove(id);
  }
}
