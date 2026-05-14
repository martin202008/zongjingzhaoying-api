import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, CustomerTag, Project, ProjectTag, Recommendation } from '../database/entities';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(CustomerTag)
    private customerTagRepository: Repository<CustomerTag>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectTag)
    private projectTagRepository: Repository<ProjectTag>,
    @InjectRepository(Recommendation)
    private recommendationRepository: Repository<Recommendation>,
  ) {}

  async recommendProjects(customerId: number): Promise<any[]> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) return [];

    const customerTags = await this.customerTagRepository.find({ where: { customerId } });
    const projects = await this.projectRepository.find();

    const scores = await Promise.all(
      projects.map(async (project) => {
        const projectTags = await this.projectTagRepository.find({ where: { projectId: project.id } });

        let matchScore = 0;
        let reasons: string[] = [];

        // 行业匹配 (40%)
        const customerIndustry = customer.brandType || '';
        const projectIndustries = projectTags.filter(t => t.tagKey === 'industry').map(t => t.tagValue);
        if (projectIndustries.some(i => customerIndustry.includes(i) || i.includes(customerIndustry))) {
          matchScore += 40;
          reasons.push(`行业匹配: ${customerIndustry} vs ${projectIndustries.join(',')}`);
        }

        // 面积匹配 (30%)
        const customerArea = customer.intentionArea || '';
        const projectAreas = projectTags.filter(t => t.tagKey === 'floor').map(t => t.tagValue);
        if (projectAreas.includes(customerArea)) {
          matchScore += 30;
          reasons.push(`面积匹配: ${customerArea}`);
        }

        // 客群匹配 (20%)
        const customerLevel = customer.level || 'C';
        const projectLevels = projectTags.filter(t => t.tagKey === 'target').map(t => t.tagValue);
        if (projectLevels.includes(customerLevel)) {
          matchScore += 20;
          reasons.push(`客群匹配: ${customerLevel}级客户`);
        }

        // 租金匹配 (10%)
        const customerBudget = 5000; // 默认预算
        if (project.minRent && project.minRent <= customerBudget) {
          matchScore += 10;
          reasons.push(`租金合适: ¥${project.minRent}/月`);
        }

        return {
          project_id: project.id,
          project_name: project.name,
          score: matchScore,
          reason: reasons.join(' + ') || '基础匹配',
        };
      })
    );

    return scores.sort((a, b) => b.score - a.score);
  }

  async recommendShops(customerId: number): Promise<any[]> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) return [];

    const customerTags = await this.customerTagRepository.find({ where: { customerId } });
    const shops = await this.projectRepository.find().then(projects =>
      this.recommendationRepository.query("SELECT shops.*, projects.name as project_name FROM shops LEFT JOIN projects ON shops.project_id = projects.id WHERE shops.status = 'available'")
    );

    const results = shops.map((shop: any) => {
      let matchScore = 0;
      let reasons: string[] = [];

      // 面积匹配
      if (customer.intentionArea && shop.area) {
        const minArea = parseInt(customer.intentionArea.split('-')[0] || '0');
        const maxArea = parseInt(customer.intentionArea.split('-')[1] || '9999');
        if (shop.area >= minArea && shop.area <= maxArea) {
          matchScore += 35;
          reasons.push(`面积匹配: ${shop.area}㎡`);
        }
      }

      // 租金匹配
      if (customer.storeCount && customer.storeCount > 10 && shop.rent) {
        matchScore += 25;
        reasons.push(`租金合适: ¥${shop.rent}/月`);
      }

      // 楼层匹配
      if (customerTags.find(t => t.tagKey === 'floor' && t.tagValue === shop.floor)) {
        matchScore += 20;
        reasons.push(`楼层匹配: ${shop.floor}`);
      }

      // 客户等级匹配
      if (customer.level === 'A' && shop.status === 'available') {
        matchScore += 20;
        reasons.push('优质商铺可用');
      }

      return {
        shop_id: shop.id,
        project_name: shop.project_name,
        shop_code: shop.shop_code,
        floor: shop.floor,
        area: shop.area,
        rent: shop.rent,
        score: matchScore,
        reason: reasons.join(' + ') || '基础匹配',
      };
    });

    return results.sort((a: any, b: any) => b.score - a.score);
  }

  async saveRecommendation(customerId: number, projectId: number, score: number): Promise<Recommendation> {
    const recommendation = this.recommendationRepository.create({ customerId, projectId, score });
    return this.recommendationRepository.save(recommendation);
  }

  async getHistory(customerId: number): Promise<Recommendation[]> {
    return this.recommendationRepository.find({
      where: { customerId },
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }

  async getProjectRecommendations(customerId: number): Promise<any[]> {
    return this.recommendProjects(customerId);
  }

  async getShopRecommendations(customerId: number): Promise<any[]> {
    return this.recommendShops(customerId);
  }

  async feedback(customerId: number, projectId: number, score: number): Promise<void> {
    const recommendation = await this.recommendationRepository.findOne({
      where: { customerId, projectId },
      order: { createdAt: 'DESC' },
    });
    if (recommendation) {
      recommendation.feedbackScore = score;
      await this.recommendationRepository.save(recommendation);
    }
  }
}