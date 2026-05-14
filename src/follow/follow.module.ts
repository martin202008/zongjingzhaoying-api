import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowRecord, Lead } from '../database/entities';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
  imports: [TypeOrmModule.forFeature([FollowRecord, Lead])],
  controllers: [FollowController],
  providers: [FollowService]
})
export class FollowModule {}