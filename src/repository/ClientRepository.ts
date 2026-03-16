import { Like, Repository } from 'typeorm';
import { dataSource } from '../../config/database/data-source';
import { Client } from '../entity/Client';
import { Motorcycle } from '../entity/Motorcycle';

export class ClientRepository {
  private repository: Repository<Client>;

  constructor() {
    this.repository = dataSource.getRepository(Client);
  }

  async findAll(): Promise<Client[]> {
    return this.repository.find({
      relations: ['motorcycles'],
    });
  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: Client[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      relations: ['motorcycles'],
      skip,
      take: limit,
    });

    return { data, total };
  }

  async findById(id: string): Promise<Client | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['motorcycles'],
    });
  }

  async findByCpf(cpf: string): Promise<Client | null> {
    return this.repository.findOne({
      where: { cpf },
      relations: ['motorcycles'],
    });
  }

  async findByTelephone(telephone: string): Promise<Client | null> {
    return this.repository.findOne({
      where: { telephone },
      relations: ['motorcycles'],
    });
  }

  async create(data: Partial<Client>): Promise<Client> {
    const client = this.repository.create(data);
    return this.repository.save(client);
  }

  async update(id: string, data: Partial<Client>): Promise<Client | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async updateWithMotorcycles(id: string, data: Partial<Client>): Promise<Client | null> {
    const client = await this.findById(id);
    if (!client) {
      return null;
    }

    // Update scalar fields
    const { motorcycles, ...scalarData } = data;
    
    if (Object.keys(scalarData).length > 0) {
      await this.repository.update(id, scalarData);
    }

    // Handle motorcycles if provided
    if (motorcycles && Array.isArray(motorcycles)) {
      const motorcycleRepository = dataSource.getRepository(Motorcycle);
      
      // Delete existing motorcycles
      await motorcycleRepository.delete({ client: { id } });
      
      // Create new motorcycles
      if (motorcycles.length > 0) {
        for (const m of motorcycles) {
          const motorcycle = motorcycleRepository.create({
            ...m,
            client: { id } as any,
          });
          await motorcycleRepository.save(motorcycle);
        }
      }
    }

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findByName(name: string): Promise<Client[]> {
    return this.repository.find({
      where: { name: Like(`%${name}%`) },
      relations: ['motorcycles'],
    });
  }

  async findForDropdown(name: string | undefined, limit: number): Promise<Client[]> {
    const where = name
      ? { name: Like(`%${name}%`) }
      : {};

    return this.repository.find({
      where,
      select: ['id', 'name', 'createdAt'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
