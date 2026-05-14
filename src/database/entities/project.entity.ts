import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Shop } from './shop.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ length: 100 })
  city: string;

  @Column()
  address: string;

  @Column({ name: 'total_area' })
  totalArea: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'cover_image', nullable: true })
  coverImage: string;

  @Column({ name: 'min_rent', type: 'float', nullable: true })
  minRent: number;

  @Column({ name: 'business_type', nullable: true })
  businessType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Shop, shop => shop.project)
  shops: Shop[];
}