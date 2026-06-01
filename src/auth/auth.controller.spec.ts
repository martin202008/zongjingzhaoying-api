import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { User } from '../database/entities';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new (require('@nestjs/common').ValidationPipe)({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    // 清空 users 表
    await dataSource.getRepository(User).clear();
  });

  describe('POST /auth/login', () => {
    it('should return 400 when body is empty', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
      expect(response.body.message).toBeDefined();
    });

    it('should return 400 when username is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: 'admin123' })
        .expect(400);
      expect(response.body.message).toBeDefined();
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin' })
        .expect(400);
      expect(response.body.message).toBeDefined();
    });

    it('should reject unknown fields (whitelist protection)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'admin123', isAdmin: true })
        .expect(400);
      expect(response.body.message).toBeDefined();
    });

    it('should return 401 with valid format but wrong credentials', async () => {
      // 触发默认用户创建
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'admin123' })
        .expect(200);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'wrong' })
        .expect(401);
      expect(response.body.code).toBe(401);
    });

    it('should return 200 with token on correct credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'admin123' })
        .expect(200);
      expect(response.body.code).toBe(0);
      expect(response.body.data.access_token).toBeDefined();
      expect(response.body.data.user.username).toBe('admin');
    });
  });
});
