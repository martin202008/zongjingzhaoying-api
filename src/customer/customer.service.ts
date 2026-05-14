import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../database/entities';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async findAll(filters?: { level?: string; status?: string; brandName?: string }): Promise<Customer[]> {
    const where: any = {};
    if (filters?.level) where.level = filters.level;
    if (filters?.status) where.status = filters.status;
    if (filters?.brandName) where.brandName = filters.brandName;

    return this.customerRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { id },
      relations: ['leads'],
    });
  }

  async create(data: Partial<Customer>): Promise<Customer> {
    const customer = this.customerRepository.create(data);
    return this.customerRepository.save(customer);
  }

  async update(id: number, data: Partial<Customer>): Promise<Customer | null> {
    await this.customerRepository.update(id, data);
    return this.findOne(id);
  }
}