import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerTag, ProjectTag } from '../database/entities';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(CustomerTag)
    private customerTagRepository: Repository<CustomerTag>,
    @InjectRepository(ProjectTag)
    private projectTagRepository: Repository<ProjectTag>,
  ) {}

  async setCustomerTag(customerId: number, tagKey: string, tagValue: string): Promise<CustomerTag> {
    const existing = await this.customerTagRepository.findOne({
      where: { customerId, tagKey },
    });

    if (existing) {
      existing.tagValue = tagValue;
      return this.customerTagRepository.save(existing);
    }

    const tag = this.customerTagRepository.create({ customerId, tagKey, tagValue });
    return this.customerTagRepository.save(tag);
  }

  async getCustomerTags(customerId: number): Promise<CustomerTag[]> {
    return this.customerTagRepository.find({ where: { customerId } });
  }

  async deleteCustomerTag(id: number): Promise<void> {
    await this.customerTagRepository.delete(id);
  }

  async setProjectTag(projectId: number, tagKey: string, tagValue: string): Promise<ProjectTag> {
    const existing = await this.projectTagRepository.findOne({
      where: { projectId, tagKey },
    });

    if (existing) {
      existing.tagValue = tagValue;
      return this.projectTagRepository.save(existing);
    }

    const tag = this.projectTagRepository.create({ projectId, tagKey, tagValue });
    return this.projectTagRepository.save(tag);
  }

  async getProjectTags(projectId: number): Promise<ProjectTag[]> {
    return this.projectTagRepository.find({ where: { projectId } });
  }

  async deleteProjectTag(id: number): Promise<void> {
    await this.projectTagRepository.delete(id);
  }

  async setCustomerTags(customerId: number, tags: { key: string; value: string }[]): Promise<void> {
    for (const tag of tags) {
      await this.setCustomerTag(customerId, tag.key, tag.value);
    }
  }

  async setProjectTags(projectId: number, tags: { key: string; value: string }[]): Promise<void> {
    for (const tag of tags) {
      await this.setProjectTag(projectId, tag.key, tag.value);
    }
  }
}