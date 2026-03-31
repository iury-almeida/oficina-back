import { Client } from '../entity/Client';
import { ClientRepository } from '../repository/ClientRepository';
import { normalizeDocument, isValidDocumentLength } from '../helpers/documentUtils';

export class ClientService {
  private repository: ClientRepository;

  constructor() {
    this.repository = new ClientRepository();
  }

  public async getAll(page: number, limit: number): Promise<{
    data: Client[];
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

  public async getBycpf(cpf: string): Promise<Client | null> {
    if (!cpf) {
      throw new Error('CPF ou CNPJ é obrigatório');
    }
    const normalized = normalizeDocument(cpf);
    const client = await this.repository.findByCpf(normalized);
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }

  public async create(data: Partial<Client>): Promise<Client> {
    if (!data.name || !data.telephone) {
      throw new Error('Name and telephone are required');
    }

    if (data.cpf) {
      const rawDoc = data.cpf ?? null;
      let document: string = '';
      if (rawDoc && String(rawDoc).trim()) {
        if (!isValidDocumentLength(rawDoc)) {
          throw new Error('CPF/CNPJ inválido. Use 11 dígitos (CPF) ou 14 dígitos (CNPJ)');
        }
        document = normalizeDocument(rawDoc);
        const existingClient = await this.repository.findByCpf(document);
        if (existingClient) {
          throw new Error('Já existe cliente cadastrado com este CPF/CNPJ');
        }
      }

      return this.repository.create({ ...data, cpf: document });
    }
    else 
      return this.repository.create({ ...data, cpf: null });


  }

  public async update(id: string, data: Partial<Client>): Promise<Client | null> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    const existingClient = await this.repository.findById(id);
    if (!existingClient) {
      throw new Error('Client not found');
    }

    // Check if CPF/CNPJ is being updated
    if ('cpf' in data) {
      if (!data.cpf || !String(data.cpf).trim()) {
        // CPF removido pelo usuário — limpar o campo
        data = { ...data, cpf: null };
      } else if (data.cpf !== existingClient.cpf) {
        if (!isValidDocumentLength(data.cpf)) {
          throw new Error('CPF/CNPJ inválido. Use 11 dígitos (CPF) ou 14 dígitos (CNPJ)');
        }
        const normalizedDoc = normalizeDocument(data.cpf);
        const clientWithDoc = await this.repository.findByCpf(normalizedDoc);
        if (clientWithDoc && clientWithDoc.id !== id) {
          throw new Error('Já existe cliente cadastrado com este CPF/CNPJ');
        }
        data = { ...data, cpf: normalizedDoc };
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

  public async search(
    query: string,
    page: number,
    limit: number
  ): Promise<{ data: Client[]; total: number; page: number; limit: number; totalPages: number }> {
    if (!query || query.trim() === '') {
      throw new Error('Search query is required');
    }
    const { data, total } = await this.repository.search(query.trim(), page, limit);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  public async getForDropdown(name: string | undefined, limit: number | 0): Promise<Client[]> {
    return this.repository.findForDropdown(name, limit);
  }
}
