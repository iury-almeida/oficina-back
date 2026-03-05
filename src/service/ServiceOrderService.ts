import { ServiceOrder } from '../entity/ServiceOrder';
import { ServiceOrderRepository } from '../repository/ServiceOrderRepository';
import { ClientRepository } from '../repository/ClientRepository';
import { MotorcycleRepository } from '../../src/repository/MotorcycleRepository';
import { MechanicRepository } from '../repository/MechanicRepository';
import { saveBase64ToFile } from '../helpers/imgToText';

export class ServiceOrderService {
  private repository: ServiceOrderRepository;
  private clientRepository: ClientRepository;
  private motorcycleRepository: MotorcycleRepository;
  private mechanicRepository: MechanicRepository;

  constructor() {
    this.repository = new ServiceOrderRepository();
    this.clientRepository = new ClientRepository();
    this.motorcycleRepository = new MotorcycleRepository();
    this.mechanicRepository = new MechanicRepository();
  }

  public async getAll(page: number, limit: number): Promise<{
    data: ServiceOrder[];
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

  public async getById(id: string): Promise<ServiceOrder | null> {
    if (!id) {
      throw new Error('Service order ID is required');
    }
    const serviceOrder = await this.repository.findById(id);
    if (!serviceOrder) {
      throw new Error('Service order not found');
    }
    return serviceOrder;
  }

  public async create(data: Partial<ServiceOrder>): Promise<ServiceOrder> {
    if (!data.client || !data.motorcycle || !data.serviceType || !data.mechanic || !data.pac || !data.laborCost) {
      throw new Error('Cliente, Moto, TipoServico, Mecanico, PAC and LaborCost are required');
    }

    // Verify if related entities exist
    const client = await this.clientRepository.findById(data.client.id || '');
    if (!client) {
      throw new Error('Client not found');
    }

    const motorcycle = await this.motorcycleRepository.findById(data.motorcycle.id || '');
    if (!motorcycle) {
      throw new Error('Motorcycle not found');
    }

    const mechanic = await this.mechanicRepository.findById(data.mechanic.id || '');
    if (!mechanic) {
      throw new Error('Mechanic not found');
    }

    const serviceOrderData = {
      ...data,
      status: data.status || 'Aguardando:Vermelho',
    };

    return this.repository.create(serviceOrderData);
  }

  public async update(id: string, data: Partial<ServiceOrder>, photoBase64: string | null): Promise<ServiceOrder | null> {
    if (!id) {
      throw new Error('Service order ID is required');
    }

    const existingServiceOrder = await this.repository.findById(id);
    if (!existingServiceOrder) {
      throw new Error('Service order not found');
    }

    // Verify if related entities exist (if being updated)
    if (data.client?.id) {
      const client = await this.clientRepository.findById(data.client.id);
      if (!client) {
        throw new Error('Client not found');
      }
    }

    if (data.motorcycle?.id) {
      const motorcycle = await this.motorcycleRepository.findById(data.motorcycle.id);
      if (!motorcycle) {
        throw new Error('Motorcycle not found');
      }
    }

    if (data.mechanic?.id) {
      const mechanic = await this.mechanicRepository.findById(data.mechanic.id);
      if (!mechanic) {
        throw new Error('Mechanic not found');
      }
    }

    if (photoBase64) {
      const imagePath = await saveBase64ToFile(photoBase64 || '', process.env.RECIBO_IMG_PATH);
      data.imagePath = imagePath;
    }

    return this.repository.update(id, data);
  }

  public async delete(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Service order ID is required');
    }

    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new Error('Service order not found');
    }

    return this.repository.delete(id);
  }
}
