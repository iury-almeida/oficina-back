import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type NotificationStatus = 'pending' | 'done';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  serviceOrderId!: string;

  @Column({ type: 'varchar', nullable: false })
  clientName!: string;

  @Column({ type: 'varchar', nullable: false })
  clientPhone!: string;

  @Column({ type: 'text', nullable: false })
  message!: string;

  @Column({ type: 'int', nullable: false })
  daysToNotify!: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  notifyDate!: string;

  @Column({ type: 'enum', enum: ['pending', 'done'], default: 'pending', nullable: false })
  status!: NotificationStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'varchar', nullable: false })
  userCreateId!: string;

  @Column({ type: 'varchar', nullable: false })
  userCreateName!: string;

  @Column({ type: 'timestamp', nullable: true })
  doneAt?: Date | null;

  @Column({ type: 'varchar', nullable: true })
  userDoneId?: string | null;

  @Column({ type: 'varchar', nullable: true })
  userDoneName?: string | null;
}
