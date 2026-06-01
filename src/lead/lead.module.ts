import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from '../database/entities';
import { FollowRecord } from '../database/entities';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, FollowRecord])],
  controllers: [LeadController],
  providers: [LeadService]
})
export class LeadModule {}
