import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../database/entities';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async create(data: { brandName: string; contactName: string; phone: string; projectId?: number; intentionArea?: string; intentionCity?: string }): Promise<Application> {
    const application = this.applicationRepository.create({
      brandName: data.brandName,
      contactName: data.contactName,
      phone: data.phone,
      projectId: data.projectId || 0,
      intentionArea: data.intentionArea,
      intentionCity: data.intentionCity,
    });
    return this.applicationRepository.save(application);
  }

  async findAll(): Promise<Application[]> {
    return this.applicationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, data: { status?: string }): Promise<Application | null> {
    await this.applicationRepository.update(id, {
      status: data.status,
    });
    return this.applicationRepository.findOne({ where: { id } });
  }
}
