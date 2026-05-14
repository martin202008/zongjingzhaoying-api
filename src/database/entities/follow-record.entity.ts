import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lead } from './lead.entity';

@Entity('follow_records')
export class FollowRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'lead_id' })
  leadId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'follow_time', type: 'datetime' })
  followTime: Date;

  @Column({ name: 'next_follow_time', type: 'datetime', nullable: true })
  nextFollowTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Lead, lead => lead.followRecords)
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;
}