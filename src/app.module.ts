import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './project/project.module';
import { ShopModule } from './shop/shop.module';
import { ApplicationModule } from './application/application.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { LeadModule } from './lead/lead.module';
import { FollowModule } from './follow/follow.module';
import { StatsModule } from './stats/stats.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { TagModule } from './tag/tag.module';
import { AiModule } from './ai/ai.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    DatabaseModule,
    ProjectModule,
    ShopModule,
    ApplicationModule,
    AdminModule,
    AuthModule,
    CustomerModule,
    LeadModule,
    FollowModule,
    StatsModule,
    RecommendationModule,
    TagModule,
    AiModule,
    UploadModule,
  ],
})
export class AppModule {}