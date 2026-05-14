import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'brand_name' })
  brandName: string;

  @Column({ name: 'contact_name' })
  contactName: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ name: 'intention_area', length: 50, nullable: true })
  intentionArea: string;

  @Column({ name: 'intention_city', length: 50, nullable: true })
  intentionCity: string;

  @Column({ length: 20, default: 'pending' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}