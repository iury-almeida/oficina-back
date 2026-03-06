import { In, Repository } from 'typeorm';
import { dataSource } from '../../config/database/data-source';
import { ServiceOrder } from '../entity/ServiceOrder';

export class ServiceOrderRepository {
  private repository: Repository<ServiceOrder>;

  constructor() {
    this.repository = dataSource.getRepository(ServiceOrder);
  }

  async findAll(): Promise<ServiceOrder[]> {
    return this.repository.find({
      relations: ['client', 'motorcycle', 'mechanic'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: ServiceOrder[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      relations: ['client', 'motorcycle', 'mechanic'],
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    return { data, total };
  }

  // async findPaginatedFiltered(
  //   page: number,
  //   limit: number,
  //   statusFilters: string[]
  // ): Promise<{ data: ServiceOrder[]; total: number }> {
  //   const skip = (page - 1) * limit;

  //   const [data, total] = await this.repository.findAndCount({
  //     where: statusFilters.length > 0 ? { status: In(statusFilters) } : {},
  //     relations: ['client', 'motorcycle', 'mechanic'],
  //     order: { createdAt: 'ASC' },
  //     skip,
  //     take: limit,
  //   });

  //   return { data, total };
  // }

  async findById(id: string): Promise<ServiceOrder | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['client', 'motorcycle', 'mechanic'],
    });
  }

  async create(data: Partial<ServiceOrder>): Promise<ServiceOrder> {
    const serviceOrder = this.repository.create(data);
    return this.repository.save(serviceOrder);
  }

  async update(id: string, data: Partial<ServiceOrder>): Promise<ServiceOrder | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
