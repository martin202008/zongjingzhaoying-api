import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Lead } from '../database/entities';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async findAll(filters?: { status?: string; projectId?: number; assignedTo?: number; stage?: string }): Promise<Lead[]> {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.projectId) where.projectId = filters.projectId;
    if (filters?.assignedTo) where.assignedTo = filters.assignedTo;
    if (filters?.stage) where.stage = filters.stage;

    return this.leadRepository.find({
      where,
      relations: ['customer', 'project', 'assignedUser'],
      order: {
        level: 'ASC',
        nextFollowTime: 'ASC',
        lastFollowTime: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  async findOverdue(): Promise<Lead[]> {
    const now = new Date();
    return this.leadRepository.find({
      where: {
        nextFollowTime: LessThan(now),
        stage: LessThan('signed'),
      },
      relations: ['customer', 'project', 'assignedUser'],
      order: { nextFollowTime: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Lead | null> {
    return this.leadRepository.findOne({
      where: { id },
      relations: ['customer', 'project', 'assignedUser', 'followRecords'],
    });
  }

  async create(data: Partial<Lead>): Promise<Lead> {
    // 自动设置等级
    if (!data.level) {
      const customer = data.customerId;
      data.level = 'C';
    }
    // 设置初始阶段
    if (!data.stage) {
      data.stage = 'new';
    }
    // 设置下次跟进时间（默认3天后）
    if (!data.nextFollowTime) {
      const threeDaysLater = new Date();
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);
      data.nextFollowTime = threeDaysLater;
    }
    const lead = this.leadRepository.create(data);
    return this.leadRepository.save(lead);
  }

  async assign(id: number, assignedTo: number): Promise<Lead | null> {
    await this.leadRepository.update(id, { assignedTo, status: 'following', stage: 'contacted' });
    return this.findOne(id);
  }

  async updateStatus(id: number, status: string): Promise<Lead | null> {
    await this.leadRepository.update(id, { status });
    return this.findOne(id);
  }

  async updateStage(id: number, stage: string, nextFollowTime?: Date): Promise<Lead | null> {
    const updateData: any = { stage };
    if (nextFollowTime) updateData.nextFollowTime = nextFollowTime;
    await this.leadRepository.update(id, updateData);
    return this.findOne(id);
  }

  async getStats(): Promise<{ new: number; contacted: number; visit: number; negotiation: number; signed: number; lost: number; total: number }> {
    const [newLeads, contacted, visit, negotiation, signed, lost, total] = await Promise.all([
      this.leadRepository.count({ where: { stage: 'new' } }),
      this.leadRepository.count({ where: { stage: 'contacted' } }),
      this.leadRepository.count({ where: { stage: 'visit' } }),
      this.leadRepository.count({ where: { stage: 'negotiation' } }),
      this.leadRepository.count({ where: { stage: 'signed' } }),
      this.leadRepository.count({ where: { stage: 'lost' } }),
      this.leadRepository.count(),
    ]);
    return { new: newLeads, contacted, visit, negotiation, signed, lost, total };
  }
}