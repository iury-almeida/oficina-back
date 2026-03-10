import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // @Column({ unique: true })
  // email!: string;
  @Column({unique: true, nullable: false})
  cpf!: string

  @Column({nullable: false})
  passwordHash!: string;

  @Column({nullable: false})
  name!: string;

  @Column({nullable: false})
  telephone!: string;

  @Column({nullable: true})
  endereco!: string;

  @Column({nullable: true})
  cep?: string;

  @Column({ default: true, nullable: false })
  active!: boolean;

  @Column({ default: false, nullable: false })
  adm!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
