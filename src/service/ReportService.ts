import { ReportRepository, ReportResult } from '../repository/ReportRepository';

export class ReportService {
  private repository: ReportRepository;

  constructor() {
    this.repository = new ReportRepository();
  }

  public async getCompletedServiceOrders(
    startDate: string,
    endDate: string,
    status: string,
    limit: number,
  ): Promise<ReportResult> {
    // Parseando como horário local (evita interpretação UTC de 'YYYY-MM-DD')
    const [sy, sm, sd] = startDate.split('-').map(Number);
    const [ey, em, ed] = endDate.split('-').map(Number);
    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format. Use YYYY-MM-DD.');
    }

    if (start > end) {
      throw new Error('startDate must be before or equal to endDate.');
    }

    const statuses = status
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    return this.repository.findCompletedByPeriod(start, end, statuses, limit);
  }
}
