import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../database/entities';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
  ) {}

  async findAll(projectId?: number): Promise<Shop[]> {
    const where = projectId ? { projectId } : {};
    return this.shopRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Shop | null> {
    return this.shopRepository.findOne({
      where: { id },
      relations: ['project'],
    });
  }

  async create(data: Partial<Shop>): Promise<Shop> {
    if (data.rent === undefined || data.rent === null) {
      data.rent = 0;
    }
    const shop = this.shopRepository.create(data);
    return this.shopRepository.save(shop);
  }

  async update(id: number, data: Partial<Shop>): Promise<Shop | null> {
    await this.shopRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.shopRepository.delete(id);
  }
}