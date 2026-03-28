import { Like, Repository } from 'typeorm';
import { dataSource } from '../../config/database/data-source';
import { Client } from '../entity/Client';
import { Motorcycle } from '../entity/Motorcycle';
import { ServiceOrder } from '../entity/ServiceOrder';

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
      order: {
        createdAt: 'DESC',
      },
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
      const serviceOrderRepository = dataSource.getRepository(ServiceOrder);

      const incomingIds = motorcycles.filter(m => m.id).map(m => m.id as string);
      const existingMotorcycles = client.motorcycles ?? [];

      // Remove motorcycles that are no longer in the payload.
      // Throws if the motorcycle has linked service orders (FK constraint).
      for (const existing of existingMotorcycles) {
        if (!incomingIds.includes(existing.id)) {
          const linkedOrders = await serviceOrderRepository.count({
            where: { motorcycle: { id: existing.id } },
          });
          if (linkedOrders > 0) {
            const name = existing.model ?? 'Desconhecida';
            const plate = existing.licensePlate ?? 'sem placa';
            throw new Error(
              `A moto '${name}' - '${plate}' não pode ser removida pois está vinculada a uma ordem de serviço.`,
            );
          }
          await motorcycleRepository.delete(existing.id);
        }
      }

      // Upsert each motorcycle from the payload
      for (const m of motorcycles) {
        if (m.id) {
          // Motorcycle already exists — update in-place to preserve its PK
          const { brand, model, yearModel, color, licensePlate } = m;
          const scalarFields: Partial<Motorcycle> = {};
          if (brand !== undefined) scalarFields.brand = brand;
          if (model !== undefined) scalarFields.model = model;
          if (yearModel !== undefined) scalarFields.yearModel = yearModel;
          if (color !== undefined) scalarFields.color = color;
          if (licensePlate !== undefined) scalarFields.licensePlate = licensePlate;
          if (Object.keys(scalarFields).length > 0) {
            await motorcycleRepository.update(m.id, scalarFields);
          }
        } else {
          // New motorcycle — create it
          const { brand, model, yearModel, color, licensePlate } = m;
          const motorcycle = motorcycleRepository.create({
            brand,
            model,
            yearModel,
            color,
            licensePlate,
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
      select: ['id', 'name', 'createdAt', 'telephone'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async search(
    query: string,
    page: number,
    limit: number
  ): Promise<{ data: Client[]; total: number }> {
    const skip = (page - 1) * limit;
    const term = `%${query}%`;

    const [data, total] = await this.repository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.motorcycles', 'motorcycles')
      .where('client.name LIKE :term', { term })
      .orWhere('client.telephone LIKE :term', { term })
      .orWhere('client.cpf LIKE :term', { term })
      .orderBy('client.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }
}
