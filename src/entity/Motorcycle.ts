import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from './Client';

@Entity('motorcycles')
export class Motorcycle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  brand!: string;

  @Column({ nullable: false })
  model!: string;

  @Column({ nullable: true })
  yearModel?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  licensePlate?: string;

  @ManyToOne(() => Client, (client) => client.motorcycles, { onDelete: 'CASCADE' })
  client!: Client;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
