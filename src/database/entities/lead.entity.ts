import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Customer } from './customer.entity';
import { Project } from './project.entity';
import { User } from './user.entity';
import { FollowRecord } from './follow-record.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ length: 50, nullable: true })
  source: string;

  @Column({ name: 'project_id', nullable: true })
  projectId: number;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: number;

  @Column({ length: 20, default: 'new' })
  status: string;

  @Column({ length: 1, default: 'C', name: 'level' })
  level: string;

  @Column({ length: 20, default: 'new', name: 'stage' })
  stage: string;

  @Column({ name: 'next_follow_time', type: 'datetime', nullable: true })
  nextFollowTime: Date;

  @Column({ name: 'last_follow_time', type: 'datetime', nullable: true })
  lastFollowTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Customer, customer => customer.leads)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to' })
  assignedUser: User;

  @OneToMany(() => FollowRecord, follow => follow.lead)
  followRecords: FollowRecord[];
}