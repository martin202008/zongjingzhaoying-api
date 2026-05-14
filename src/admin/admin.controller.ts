import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectService } from '../project/project.service';
import { ShopService } from '../shop/shop.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly shopService: ShopService,
  ) {}

  @Post('projects')
  async createProject(@Body() data: any) {
    const project = await this.projectService.create(data);
    return { code: 0, data: project, message: 'success' };
  }

  @Post('shops')
  async createShop(@Body() data: any) {
    const shop = await this.shopService.create(data);
    return { code: 0, data: shop, message: 'success' };
  }
}