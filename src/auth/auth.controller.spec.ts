import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

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

  // Note: no beforeEach clear — onModuleInit seeds the admin user,
  // and tests #5/#6 rely on that user existing. Tests #1-#4 (validation)
  // don't touch the user table.

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
      // admin user already exists via onModuleInit seed
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
