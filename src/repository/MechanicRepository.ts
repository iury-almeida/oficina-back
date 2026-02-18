import { Repository } from 'typeorm';
import { dataSource } from '../../config/database/data-source';
import { Mechanic } from '../entity/Mechanic';

export class MechanicRepository {
  private repository: Repository<Mechanic>;

  constructor() {
    this.repository = dataSource.getRepository(Mechanic);
  }

  async findAll(): Promise<Mechanic[]> {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: string): Promise<Mechanic | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByCpf(cpf: string): Promise<Mechanic | null> {
    return this.repository.findOne({
      where: { cpf },
    });
  }

  async findByTelephone(telephone: string): Promise<Mechanic | null> {
    return this.repository.findOne({
      where: { telephone },
    });
  }

  async create(data: Partial<Mechanic>): Promise<Mechanic> {
    const mechanic = this.repository.create(data);
    return this.repository.save(mechanic);
  }

  async update(id: string, data: Partial<Mechanic>): Promise<Mechanic | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findByName(name: string): Promise<Mechanic[]> {
    return this.repository
      .createQueryBuilder('mechanic')
      .where('mechanic.name LIKE :name', { name: `%${name}%` })
      .orderBy('mechanic.createdAt', 'DESC')
      .getMany();
  }

  async findByStatus(status: boolean): Promise<Mechanic[]> {
    return this.repository.find({
      where: { status },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
