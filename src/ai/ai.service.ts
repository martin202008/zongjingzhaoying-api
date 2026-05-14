import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, Project, Recommendation } from '../database/entities';

export interface CustomerAnalysisResult {
  match_score: number;
  analysis: string;
  risk: string;
  suggestion: string;
}

export interface ProjectAnalysisResult {
  match_score: number;
  analysis: string;
  risk: string;
  suggestion: string;
}

export interface ConversationResult {
  title: string;
  key_points: string[];
  suggested_questions: string[];
}

export interface PitchResult {
  opening: string;
  highlights: string[];
  closing: string;
}

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Recommendation)
    private recommendationRepository: Repository<Recommendation>,
  ) {}

  async recommendProjects(customerId: number): Promise<any[]> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) return [];

    const projects = await this.projectRepository.find();
    const scores = projects.map(project => {
      let matchScore = 0;
      const reasons: string[] = [];

      const customerIndustry = customer.brandType || '';
      if (project.businessType && (project.businessType.includes(customerIndustry) || customerIndustry.includes(project.businessType))) {
        matchScore += 40;
        reasons.push('行业匹配: ' + customerIndustry);
      }

      if (project.totalArea && project.totalArea <= 30000) {
        matchScore += 30;
        reasons.push('面积合适: ' + project.totalArea + '㎡');
      }

      const customerLevel = customer.level || 'C';
      if (['A', 'B'].includes(customerLevel)) {
        matchScore += 20;
        reasons.push('优质客群: ' + customerLevel + '级');
      }

      if (project.minRent && project.minRent <= 10000) {
        matchScore += 10;
        reasons.push('租金合适: ¥' + project.minRent + '/月');
      }

      return {
        project_id: project.id,
        project_name: project.name,
        score: matchScore,
        reason: reasons.join(' + ') || '基础匹配',
      };
    });

    return scores.sort((a, b) => b.score - a.score);
  }

  async recommendShops(customerId: number): Promise<any[]> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    if (!customer) return [];

    const shops = await this.recommendationRepository.query(
      "SELECT shops.*, projects.name as project_name FROM shops LEFT JOIN projects ON shops.project_id = projects.id WHERE shops.status = 'available' LIMIT 20"
    );

    return shops.map((shop: any) => {
      let matchScore = 0;
      const reasons: string[] = [];

      if (customer.intentionArea && shop.area) {
        matchScore += 35;
        reasons.push('面积匹配: ' + shop.area + '㎡');
      }
      if (customer.level === 'A') {
        matchScore += 25;
        reasons.push('优质客户优先');
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
  }

  async analyzeCustomer(customerId: number, projectId?: number): Promise<CustomerAnalysisResult> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    const project = projectId ? await this.projectRepository.findOne({ where: { id: projectId } }) : null;

    const industryScore = customer?.brandType ? 75 + Math.random() * 20 : 60;
    const risk = customer?.level === 'C' ? '客户等级较低，需谨慎跟进' : '客户资质良好';
    const projectName = project?.name || '';

    return {
      match_score: Math.round(industryScore),
      analysis: '该客户属于' + (customer?.brandType || '未知') + '行业，品牌为' + (customer?.brandName || '未知') + '。' + (project ? '项目' + projectName + '与客户匹配度较高。' : ''),
      risk,
      suggestion: project ? '建议优先推荐' + projectName + '项目，聚焦' + (customer?.brandType || '相关') + '行业需求。' : '建议完善客户标签以便精准匹配。',
    };
  }

  async analyzeProject(projectId: number, customerId?: number): Promise<ProjectAnalysisResult> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    const customer = customerId ? await this.customerRepository.findOne({ where: { id: customerId } }) : null;

    const industryScore = project && customer?.brandType ? 70 + Math.random() * 25 : 65;

    return {
      match_score: Math.round(industryScore),
      analysis: '项目' + (project?.name || '未知') + '位于' + (project?.city || '未知') + '城市，定位' + (project?.businessType || '综合') + '。',
      risk: project?.minRent && project.minRent > 100 ? '租金较高，需筛选优质客户' : '租金适中，客户群体广泛',
      suggestion: customer ? '目标客户群：' + customer.brandType + '，推荐城市：' + (customer.intentionCity || project?.city) : '建议结合目标客群标签进行精准推荐',
    };
  }

  async generateConversation(customerId: number, projectId: number): Promise<ConversationResult> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    const project = await this.projectRepository.findOne({ where: { id: projectId } });

    const customerName = customer?.brandName || '客户';
    const projectName = project?.name || '本项目';
    const city = project?.city || '核心商圈';
    const minRent = project?.minRent || '待定';

    return {
      title: customerName + '招商洽谈思路',
      key_points: [
        '开场：您好' + customerName + '，感谢您对' + projectName + '的关注。',
        '了解需求：请问您计划在什么区域拓展业务？面积需求是多少？',
        '匹配推荐：根据您的行业，建议关注' + city + '的商铺。',
        '价格洽谈：当前租金区间' + minRent + '，有优惠政策可申请。',
        '促成：本周签约可享免租期优惠。',
      ],
      suggested_questions: [
        '您对商铺层高有什么要求？',
        '您计划经营什么业态？',
        '您的预算范围是多少？',
        '您希望什么时候入驻？',
      ],
    };
  }

  async generatePitch(customerId: number, projectId: number): Promise<PitchResult> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } });
    const project = await this.projectRepository.findOne({ where: { id: projectId } });

    const customerName = customer?.brandName || '尊敬的客户';
    const projectName = project?.name || '本项目';
    const city = project?.city || '核心商圈';

    return {
      opening: customerName + '您好，我是' + projectName + '的招商经理。非常感谢您抽出宝贵时间，今天我想向您推荐我们位于' + city + '的优质商铺。',
      highlights: [
        '核心优势：' + city + '黄金地段，人流量大，商业氛围成熟。',
        '面积灵活：100-500平方米多种户型可选，可满足不同业态需求。',
        '政策支持：签约即享免租期、装修补贴等多重优惠。',
        '配套完善：周边交通便利，停车位充足。',
      ],
      closing: '非常期待能与您合作，如果您有任何疑问，随时可以联系我。谢谢！',
    };
  }

  async saveRecommendation(customerId: number, projectId: number, score: number): Promise<Recommendation> {
    const recommendation = this.recommendationRepository.create({
      customerId,
      projectId,
      score,
      createdAt: new Date(),
    });
    return this.recommendationRepository.save(recommendation);
  }

  async getRecommendationHistory(customerId: number): Promise<Recommendation[]> {
    return this.recommendationRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
      take: 20,
    });
  }

  async feedback(customerId: number, projectId: number, score: number): Promise<Recommendation> {
    const existing = await this.recommendationRepository.findOne({
      where: { customerId, projectId },
    });

    if (existing) {
      existing.score = score;
      existing.feedbackScore = score;
      return this.recommendationRepository.save(existing);
    }

    const recommendation = this.recommendationRepository.create({
      customerId,
      projectId,
      score,
      feedbackScore: score,
      createdAt: new Date(),
    });
    return this.recommendationRepository.save(recommendation);
  }
}