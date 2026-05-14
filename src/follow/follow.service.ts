import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowRecord, Lead } from '../database/entities';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowRecord)
    private followRepository: Repository<FollowRecord>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async findByLeadId(leadId: number): Promise<FollowRecord[]> {
    return this.followRepository.find({
      where: { leadId },
      order: { followTime: 'DESC' },
    });
  }

  async create(data: Partial<FollowRecord> & { leadId: number }): Promise<FollowRecord> {
    const follow = this.followRepository.create(data);
    const saved = await this.followRepository.save(follow);

    // 更新lead的跟进时间
    const now = new Date();
    const updateData: any = {
      lastFollowTime: now,
    };
    if (data.nextFollowTime) {
      updateData.nextFollowTime = data.nextFollowTime;
    }
    await this.leadRepository.update(data.leadId, updateData);

    return saved;
  }
}