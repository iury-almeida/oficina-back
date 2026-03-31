import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('mechanics')
export class Mechanic {
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

  @Column({ default: true, nullable: false })
  status!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'varchar', nullable: true })
  userCreateId?: string | null;

  @Column({ type: 'varchar', nullable: true })
  userUpdateId?: string | null;
}
