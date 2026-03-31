import { Mechanic } from '../entity/Mechanic';
import { MechanicRepository } from '../repository/MechanicRepository';
import { UserRepository } from '../repository/UserRepository';

export class MechanicService {
  private repository: MechanicRepository;
  private userRepository: UserRepository;

  constructor() {
    this.repository = new MechanicRepository();
    this.userRepository = new UserRepository();
  }

  public async getAll(page: number, limit: number): Promise<{
    data: Mechanic[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { data, total } = await this.repository.findAllPaginated(page, limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getById(id: string): Promise<any> {
    if (!id) {
      throw new Error('Mechanic ID is required');
    }
    const mechanic = await this.repository.findById(id);
    if (!mechanic) {
      throw new Error('Mechanic not found');
    }
    const result: any = { ...mechanic };
    if (mechanic.userCreateId) {
      const creator = await this.userRepository.findById(mechanic.userCreateId);
      result.userCreateName = creator?.name ?? null;
    }
    if (mechanic.userUpdateId) {
      const updater = await this.userRepository.findById(mechanic.userUpdateId);
      result.userUpdateName = updater?.name ?? null;
    }
    return result;
  }

  public async getByCpf(cpf: string): Promise<Mechanic | null> {
    if (!cpf) {
      throw new Error('CPF is required');
    }
    const mechanic = await this.repository.findByCpf(cpf);
    if (!mechanic) {
      throw new Error('Mechanic not found');
    }
    return mechanic;
  }

  public async create(data: Partial<Mechanic>): Promise<Mechanic> {
    if (!data.name || !data.telephone) {
      throw new Error('Name and telephone are required');
    }

    // Check if CPF already exists (if provided)
    if (data.cpf) {
      const existingMechanic = await this.repository.findByCpf(data.cpf);
      if (existingMechanic) {
        throw new Error('Mechanic with this CPF already exists');
      }
    }

    return this.repository.create(data);
  }

  public async update(id: string, data: Partial<Mechanic>): Promise<Mechanic | null> {
    if (!id) {
      throw new Error('Mechanic ID is required');
    }

    const existingMechanic = await this.repository.findById(id);
    if (!existingMechanic) {
      throw new Error('Mechanic not found');
    }

    // Check if CPF is being updated and already exists in another mechanic
    if (data.cpf && data.cpf !== existingMechanic.cpf) {
      const mechanicWithCpf = await this.repository.findByCpf(data.cpf);
      if (mechanicWithCpf) {
        throw new Error('Mechanic with this CPF already exists');
      }
    }

    return this.repository.update(id, data);
  }

  public async delete(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Mechanic ID is required');
    }

    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new Error('Mechanic not found');
    }

    return this.repository.delete(id);
  }

  public async searchByName(name: string): Promise<Mechanic[]> {
    if (!name) {
      throw new Error('Name is required for search');
    }
    return this.repository.findByName(name);
  }

  public async search(
    query: string,
    page: number,
    limit: number
  ): Promise<{ data: Mechanic[]; total: number; page: number; limit: number; totalPages: number }> {
    if (!query || query.trim() === '') {
      throw new Error('Search query is required');
    }
    const { data, total } = await this.repository.search(query.trim(), page, limit);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  public async getByStatus(status: boolean): Promise<Mechanic[]> {
    return this.repository.findByStatus(status);
  }
}
