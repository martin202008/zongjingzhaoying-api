import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, Shop } from '../database/entities';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
  ) {}

  async findAll(page = 1, limit = 20): Promise<{ data: Project[]; total: number }> {
    const [data, total] = await this.projectRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOne(id: number): Promise<Project | null> {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['shops'],
    });
  }

  async create(data: any): Promise<Project> {
    if (data.totalArea === '') data.totalArea = undefined;
    if (data.minRent === '') data.minRent = undefined;
    const project = this.projectRepository.create(data as Partial<Project>);
    return this.projectRepository.save(project as Project);
  }

  async update(id: number, data: Partial<Project>): Promise<Project | null> {
    await this.projectRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const shops = await this.shopRepository.count({ where: { projectId: id } });
    if (shops > 0) {
      throw new BadRequestException(`该项目下有 ${shops} 个铺位，无法删除`);
    }
    await this.projectRepository.delete(id);
  }
}