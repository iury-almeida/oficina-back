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

  async findAllPaginated(page: number, limit: number): Promise<{ data: Mechanic[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    return { data, total };
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

  async search(
    query: string,
    page: number,
    limit: number
  ): Promise<{ data: Mechanic[]; total: number }> {
    const skip = (page - 1) * limit;
    const term = `%${query}%`;

    const [data, total] = await this.repository
      .createQueryBuilder('mechanic')
      .where('mechanic.name LIKE :term', { term })
      .orWhere('mechanic.telephone LIKE :term', { term })
      .orWhere('mechanic.cpf LIKE :term', { term })
      .orderBy('mechanic.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
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
