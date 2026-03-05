import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from './Client';
import { Mechanic } from './Mechanic';
import { Motorcycle } from './Motorcycle';

@Entity('service_orders')
export class ServiceOrder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Client, { nullable: false, eager: true })
  client!: Client;

  @ManyToOne(() => Motorcycle, { nullable: false, eager: true })
  motorcycle!: Motorcycle;

  @Column({ nullable: false })
  serviceType!: string;

  @Column({ nullable: false, default: 'Aguardando:Vermelho' })
  status!: string;

  @ManyToOne(() => Mechanic, { nullable: false, eager: true })
  mechanic!: Mechanic;

  @Column({ nullable: true })
  budgetNumber?: string;

  @Column({ nullable: false })
  pac!: string;

  @Column({ nullable: true })
  dcm?: string;

  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  laborCost?: number;

  @Column({ nullable: true })
  imagePath?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
