import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, Customer, Project } from '../database/entities';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async getLeadStats(): Promise<{ newLeads: number; following: number; closed: number }> {
    const newLeads = await this.leadRepository.count({ where: { status: 'new' } });
    const following = await this.leadRepository.count({ where: { status: 'following' } });
    const closed = await this.leadRepository.count({ where: { status: 'closed' } });

    return { newLeads, following, closed };
  }

  async getConversionStats(): Promise<{ total_leads: number; signed: number; conversion_rate: number }> {
    const total = await this.leadRepository.count();
    const signed = await this.leadRepository.count({ where: { status: 'signed' } });
    const rate = total > 0 ? signed / total : 0;

    return {
      total_leads: total,
      signed,
      conversion_rate: Math.round(rate * 100) / 100,
    };
  }

  async getProjectStats(): Promise<{ project_id: number; project_name: string; leads_count: number; signed_count: number }[]> {
    const projects = await this.projectRepository.find();

    const stats = await Promise.all(
      projects.map(async (project) => {
        const leadsCount = await this.leadRepository.count({ where: { projectId: project.id } });
        const signedCount = await this.leadRepository.count({ where: { projectId: project.id, status: 'signed' } });

        return {
          project_id: project.id,
          project_name: project.name,
          leads_count: leadsCount,
          signed_count: signedCount,
        };
      })
    );

    return stats;
  }

  async getSourceStats(): Promise<{ source: string; count: number }[]> {
    const leads = await this.leadRepository.find();
    const sourceCount: Record<string, number> = {};

    leads.forEach(lead => {
      const source = lead.source || 'unknown';
      sourceCount[source] = (sourceCount[source] || 0) + 1;
    });

    return Object.entries(sourceCount).map(([source, count]) => ({ source, count }));
  }
}