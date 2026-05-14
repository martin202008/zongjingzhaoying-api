import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.createDefaultUsers();
  }

  private async createDefaultUsers() {
    const defaultPassword = 'Zx2024!';

    // Create 10 default users: zs001 - zs010
    for (let i = 1; i <= 10; i++) {
      const username = `zs${i.toString().padStart(3, '0')}`; // zs001, zs002, ... zs010
      const existing = await this.userRepository.findOne({ where: { username } });

      if (!existing) {
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        const user = this.userRepository.create({
          username,
          password: hashedPassword,
          role: 'staff',
        });
        await this.userRepository.save(user);
        console.log(`Created default user: ${username}`);
      }
    }

    // Create admin account
    const adminUsername = 'admin';
    const existingAdmin = await this.userRepository.findOne({ where: { username: adminUsername } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = this.userRepository.create({
        username: adminUsername,
        password: hashedPassword,
        role: 'admin',
      });
      await this.userRepository.save(admin);
      console.log('Created admin user: admin');
    }
  }

  async resetAdminPassword() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const existingAdmin = await this.userRepository.findOne({ where: { username: 'admin' } });
    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      await this.userRepository.save(existingAdmin);
    } else {
      const admin = this.userRepository.create({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      });
      await this.userRepository.save(admin);
    }
    return { message: 'Admin password reset successfully' };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      return { code: 401, message: 'Invalid credentials' };
    }
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      code: 0,
      data: {
        access_token: this.jwtService.sign(payload),
        user: { id: user.id, username: user.username, role: user.role },
      },
      message: 'success',
    };
  }

  async register(username: string, password: string) {
    const existing = await this.userRepository.findOne({ where: { username } });
    if (existing) {
      return { code: 400, message: 'Username already exists' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password: hashedPassword });
    await this.userRepository.save(user);
    return { code: 0, message: 'Registration successful' };
  }
}
