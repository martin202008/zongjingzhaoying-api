import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer, Project, Recommendation } from '../database/entities';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Project, Recommendation])],
  controllers: [AiController],
  providers: [AiService]
})
export class AiModule {}