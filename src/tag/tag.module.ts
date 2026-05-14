import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTag, ProjectTag } from '../database/entities';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTag, ProjectTag])],
  controllers: [TagController],
  providers: [TagService]
})
export class TagModule {}