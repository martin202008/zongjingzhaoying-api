import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('leads')
  async getLeadStats() {
    return this.statsService.getLeadStats();
  }

  @Get('conversion')
  async getConversionStats() {
    return this.statsService.getConversionStats();
  }

  @Get('projects')
  async getProjectStats() {
    return this.statsService.getProjectStats();
  }

  @Get('source')
  async getSourceStats() {
    return this.statsService.getSourceStats();
  }
}