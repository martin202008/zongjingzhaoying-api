import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Lead } from './lead.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'brand_name' })
  brandName: string;

  @Column({ name: 'contact_name' })
  contactName: string;

  @Column({ length: 50 })
  phone: string;

  @Column({ name: 'brand_type', length: 100, nullable: true })
  brandType: string;

  @Column({ name: 'store_count', nullable: true })
  storeCount: number;

  @Column({ name: 'intention_area', length: 50, nullable: true })
  intentionArea: string;

  @Column({ name: 'intention_city', length: 100, nullable: true })
  intentionCity: string;

  @Column({ length: 10, default: 'C' })
  level: string;

  @Column({ length: 20, default: 'new' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Lead, lead => lead.customer)
  leads: Lead[];
}