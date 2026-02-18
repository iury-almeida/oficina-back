import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Motorcycle } from './Motorcycle';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  telephone!: string;

  @Column({ nullable: true, unique: true })
  cpf?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  cep?: string;

  @OneToMany(() => Motorcycle, (motorcycle) => motorcycle.client, { cascade: true, eager: true })
  motorcycles!: Motorcycle[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
