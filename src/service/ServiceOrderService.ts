import { ServiceOrder } from '../entity/ServiceOrder';
import { ServiceOrderRepository } from '../repository/ServiceOrderRepository';
import { ClientRepository } from '../repository/ClientRepository';
import { MotorcycleRepository } from '../../src/repository/MotorcycleRepository';
import { MechanicRepository } from '../repository/MechanicRepository';
import { saveBase64ToFile } from '../helpers/imgToText';
import fs from 'fs';
import path from 'path';

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

  // private static readonly DEFAULT_STATUS_FILTERS = ['aguardando', 'iniciado', 'concluído'];
  // private static readonly STATUS_MAP: Record<string, string> = {
  //   aguardando: 'Aguardando',
  //   iniciado: 'Iniciado',
  //   concluido: 'Concluído',
  //   'concluído': 'Concluído',
  // };

  // public async getFilteredList(
  //   page: number,
  //   limit: number,
  //   statusParam?: string
  // ): Promise<{
  //   data: ServiceOrder[];
  //   total: number;
  //   page: number;
  //   limit: number;
  //   totalPages: number;
  // }> {
  //   const statusFilters = statusParam
  //     ? statusParam.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  //     : ServiceOrderService.DEFAULT_STATUS_FILTERS;

  //   const dbPatterns = statusFilters.map(
  //     (s) => ServiceOrderService.STATUS_MAP[s] || s.charAt(0).toUpperCase() + s.slice(1)
  //   );

  //   const { data, total } = await this.repository.findPaginatedFiltered(page, limit, dbPatterns);

  //   return {
  //     data,
  //     total,
  //     page,
  //     limit,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

  public async getById(id: string): Promise<ServiceOrder & { imageBase64?: string } | null> {
    if (!id) {
      throw new Error('Service order ID is required');
    }
    const serviceOrder = await this.repository.findById(id);
    if (!serviceOrder) {
      throw new Error('Service order not found');
    }

    if (serviceOrder.imagePath) {
      try {
        const filename = path.basename(serviceOrder.imagePath);
        const imgPath = path.join(process.cwd(), 'img', filename);
        if (fs.existsSync(imgPath)) {
          const fileBuffer = fs.readFileSync(imgPath);
          const ext = path.extname(filename).replace('.', '').toLowerCase();
          const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
          (serviceOrder as any).imageBase64 = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
        }
      } catch {
        (serviceOrder as any).imageBase64 = null;
        // imagem não encontrada ou ilegível — retorna sem o base64
      }
    }

    return serviceOrder;
  }

  public async filter(
    query: string | undefined,
    status: string | undefined,
    page: number,
    limit: number
  ): Promise<{ data: ServiceOrder[]; total: number; page: number; limit: number; totalPages: number }> {
    const statuses = status
      ? status.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const { data, total } = await this.repository.findFiltered(
      query?.trim() || undefined,
      statuses,
      page,
      limit,
    );
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
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
