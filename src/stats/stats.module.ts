import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead, Customer, Project } from '../database/entities';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Customer, Project])],
  controllers: [StatsController],
  providers: [StatsService]
})
export class StatsModule {}