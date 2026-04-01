import { Repository } from 'typeorm';
import { dataSource } from '../../config/database/data-source';
import { ServiceOrder } from '../entity/ServiceOrder';

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export interface ReportRow {
  budgetNumber: string | null;
  clientName: string;
  motorcycleBrand: string;
  motorcycleModel: string;
  licensePlate: string | null;
  serviceType: string;
  mechanicName: string;
  laborCost: number;
  createdAt: string;
}

export interface ReportResult {
  data: ReportRow[];
  totalOS: number;
  totalLaborCost: number;
}

export class ReportRepository {
  private repository: Repository<ServiceOrder>;

  constructor() {
    this.repository = dataSource.getRepository(ServiceOrder);
  }

  async findCompletedByPeriod(
    startDate: Date,
    endDate: Date,
    statuses: string[],
    limit: number,
    dateFilterType: 'createdAt' | 'updatedAt' = 'createdAt',
  ): Promise<ReportResult> {
    const dateField = dateFilterType === 'updatedAt' ? 'so.updatedAt' : 'so.createdAt';

    const qb = this.repository
      .createQueryBuilder('so')
      .leftJoinAndSelect('so.client', 'client')
      .leftJoinAndSelect('so.motorcycle', 'motorcycle')
      .leftJoinAndSelect('so.mechanic', 'mechanic')
      .where(`DATE(${dateField}) >= DATE(:startDate)`, { startDate })
      .andWhere(`DATE(${dateField}) <= DATE(:endDate)`, { endDate })
      .andWhere('so.status IN (:...statuses)', { statuses })
      .orderBy(dateField, 'DESC')
      .take(limit);

    const data = await qb.getMany();

    const totalLaborCost = data.reduce((sum, so) => sum + Number(so.laborCost ?? 0), 0);

    const rows: ReportRow[] = data.map((so) => ({
      budgetNumber: so.budgetNumber ?? null,
      clientName: so.client?.name ?? '',
      motorcycleBrand: so.motorcycle?.brand ?? '',
      motorcycleModel: so.motorcycle?.model ?? '',
      licensePlate: so.motorcycle?.licensePlate ?? null,
      serviceType: so.serviceType,
      mechanicName: so.mechanic?.name ?? '',
      laborCost: Number(so.laborCost ?? 0),
      createdAt: formatLocalDate(so.createdAt),
      updatedAt: formatLocalDate(so.updatedAt),
    }));

    return { data: rows, totalOS: rows.length, totalLaborCost };
  }
}
