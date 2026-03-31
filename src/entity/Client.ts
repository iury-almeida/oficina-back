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

  /** CPF (11 dígitos) ou CNPJ (14 dígitos). Armazenado sem pontuação. */
  @Column({ name: 'cpf', type: 'varchar', nullable: true, unique: true })
  cpf?: string | null;

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

  @Column({ type: 'varchar', nullable: true })
  userCreateId?: string | null;

  @Column({ type: 'varchar', nullable: true })
  userUpdateId?: string | null;
}
