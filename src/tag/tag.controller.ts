import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  // Customer Tags
  @Post('customer/:customer_id')
  async setCustomerTags(
    @Param('customer_id', ParseIntPipe) customerId: number,
    @Body() body: { tags: { key: string; value: string }[] }
  ) {
    await this.tagService.setCustomerTags(customerId, body.tags);
    return this.tagService.getCustomerTags(customerId);
  }

  @Get('customer/:customer_id')
  async getCustomerTags(@Param('customer_id', ParseIntPipe) customerId: number) {
    return this.tagService.getCustomerTags(customerId);
  }

  @Delete('customer/:id')
  async deleteCustomerTag(@Param('id', ParseIntPipe) id: number) {
    await this.tagService.deleteCustomerTag(id);
    return { success: true };
  }

  // Project Tags
  @Post('project/:project_id')
  async setProjectTags(
    @Param('project_id', ParseIntPipe) projectId: number,
    @Body() body: { tags: { key: string; value: string }[] }
  ) {
    await this.tagService.setProjectTags(projectId, body.tags);
    return this.tagService.getProjectTags(projectId);
  }

  @Get('project/:project_id')
  async getProjectTags(@Param('project_id', ParseIntPipe) projectId: number) {
    return this.tagService.getProjectTags(projectId);
  }

  @Delete('project/:id')
  async deleteProjectTag(@Param('id', ParseIntPipe) id: number) {
    await this.tagService.deleteProjectTag(id);
    return { success: true };
  }
}