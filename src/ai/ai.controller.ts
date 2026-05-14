import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze/customer')
  async analyzeCustomer(
    @Body() body: { customer_id: number; project_id?: number }
  ) {
    return this.aiService.analyzeCustomer(body.customer_id, body.project_id);
  }

  @Post('analyze/project')
  async analyzeProject(
    @Body() body: { project_id: number; customer_id?: number }
  ) {
    return this.aiService.analyzeProject(body.project_id, body.customer_id);
  }

  @Post('conversation/generate')
  async generateConversation(
    @Body() body: { customer_id: number; project_id: number }
  ) {
    return this.aiService.generateConversation(body.customer_id, body.project_id);
  }

  @Post('pitch/generate')
  async generatePitch(
    @Body() body: { customer_id: number; project_id: number }
  ) {
    return this.aiService.generatePitch(body.customer_id, body.project_id);
  }

  @Get('recommend/projects')
  async recommendProjects(@Query('customer_id') customerId: string) {
    return this.aiService.recommendProjects(parseInt(customerId));
  }

  @Get('recommend/shops')
  async recommendShops(@Query('customer_id') customerId: string) {
    return this.aiService.recommendShops(parseInt(customerId));
  }

  @Post('recommend/save')
  async saveRecommendation(@Body() body: { customer_id: number; project_id: number; score: number }) {
    return this.aiService.saveRecommendation(body.customer_id, body.project_id, body.score);
  }

  @Get('recommend/history/:customer_id')
  async getHistory(@Param('customer_id', ParseIntPipe) customerId: number) {
    return this.aiService.getRecommendationHistory(customerId);
  }

  @Post('recommend/feedback')
  async feedback(@Body() body: { customer_id: number; project_id: number; score: number }) {
    return this.aiService.feedback(body.customer_id, body.project_id, body.score);
  }
}