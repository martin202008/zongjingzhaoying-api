import { Controller, Get, Post, Body, Query, Param, ParseIntPipe } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('ai')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('recommend/projects')
  async recommendProjects(@Query('customer_id') customerId: string) {
    return this.recommendationService.recommendProjects(parseInt(customerId));
  }

  @Get('recommend/shops')
  async recommendShops(@Query('customer_id') customerId: string) {
    return this.recommendationService.recommendShops(parseInt(customerId));
  }

  @Post('recommend/save')
  async saveRecommendation(@Body() body: { customer_id: number; project_id: number; score: number }) {
    return this.recommendationService.saveRecommendation(body.customer_id, body.project_id, body.score);
  }

  @Get('recommend/history/:customer_id')
  async getHistory(@Param('customer_id', ParseIntPipe) customerId: number) {
    return this.recommendationService.getHistory(customerId);
  }

  @Post('recommend/feedback')
  async feedback(@Body() body: { customer_id: number; project_id: number; score: number }) {
    return this.recommendationService.feedback(body.customer_id, body.project_id, body.score);
  }
}