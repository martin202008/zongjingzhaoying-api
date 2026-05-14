import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer, CustomerTag, Project, ProjectTag, Recommendation } from '../database/entities';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerTag, Project, ProjectTag, Recommendation])],
  controllers: [RecommendationController],
  providers: [RecommendationService]
})
export class RecommendationModule {}