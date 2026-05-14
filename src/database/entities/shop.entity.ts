import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity('shops')
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ name: 'shop_code', length: 50 })
  shopCode: string;

  @Column({ length: 20, nullable: true })
  floor: string;

  @Column({ type: 'float' })
  area: number;

  @Column({ type: 'float', nullable: true })
  rent: number;

  @Column({ length: 20, default: 'available' })
  status: string;

  @Column({ name: 'image', nullable: true })
  image: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Project, project => project.shops)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}