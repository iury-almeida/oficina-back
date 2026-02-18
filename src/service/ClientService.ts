import { Client } from '../entity/Client';
import { ClientRepository } from '../repository/ClientRepository';

export class ClientService {
  private repository: ClientRepository;

  constructor() {
    this.repository = new ClientRepository();
  }

  public async getAll(): Promise<Client[]> {
    return this.repository.findAll();
  }

  public async getById(id: string): Promise<Client | null> {
    if (!id) {
      throw new Error('Client ID is required');
    }
    const client = await this.repository.findById(id);
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }

  public async getByCpf(cpf: string): Promise<Client | null> {
    if (!cpf) {
      throw new Error('CPF is required');
    }
    const client = await this.repository.findByCpf(cpf);
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }

  public async create(data: Partial<Client>): Promise<Client> {
    if (!data.name || !data.telephone) {
      throw new Error('Name and telephone are required');
    }

    // Check if CPF already exists (if provided)
    if (data.cpf) {
      const existingClient = await this.repository.findByCpf(data.cpf);
      if (existingClient) {
        throw new Error('Client with this CPF already exists');
      }
    }

    return this.repository.create(data);
  }

  public async update(id: string, data: Partial<Client>): Promise<Client | null> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    const existingClient = await this.repository.findById(id);
    if (!existingClient) {
      throw new Error('Client not found');
    }

    // Check if CPF is being updated and already exists in another client
    if (data.cpf && data.cpf !== existingClient.cpf) {
      const clientWithCpf = await this.repository.findByCpf(data.cpf);
      if (clientWithCpf) {
        throw new Error('Client with this CPF already exists');
      }
    }

    return this.repository.updateWithMotorcycles(id, data);
  }

  public async delete(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new Error('Client not found');
    }

    return this.repository.delete(id);
  }

  public async searchByName(name: string): Promise<Client[]> {
    if (!name) {
      throw new Error('Name is required for search');
    }
    return this.repository.findByName(name);
  }
}
