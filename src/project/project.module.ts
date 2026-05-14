import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project, Shop } from '../database/entities';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Shop])],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}