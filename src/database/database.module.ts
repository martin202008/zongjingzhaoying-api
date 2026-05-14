import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Project, Shop, Application, User, Customer, Lead, FollowRecord,
  CustomerTag, ProjectTag, Recommendation
} from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get('DB_TYPE', 'sqlite');

        if (dbType === 'sqlite') {
          return {
            type: 'better-sqlite3',
            database: 'zongjing.db',
            entities: [Project, Shop, Application, User, Customer, Lead, FollowRecord, CustomerTag, ProjectTag, Recommendation],
            synchronize: false,
          };
        }

        return {
          type: 'mysql',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 3306),
          username: configService.get('DB_USERNAME', 'root'),
          password: configService.get('DB_PASSWORD', 'root'),
          database: configService.get('DB_DATABASE', 'zongjing'),
          entities: [Project, Shop, Application, User, Customer, Lead, FollowRecord, CustomerTag, ProjectTag, Recommendation],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}