import { Request, Response } from 'express';
import { ReportService } from '../service/ReportService';

export class ReportController {
  private service: ReportService;

  constructor() {
    this.service = new ReportService();
  }

  public async getCompletedServiceOrders(req: Request, res: Response): Promise<Response> {
    try {
      const { startDate, endDate, status = 'Concluído', limit } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          message: 'startDate and endDate are required',
          status: 400,
        });
      }

      const limitNumber = parseInt(limit as string, 10);

      const result = await this.service.getCompletedServiceOrders(
        startDate as string,
        endDate as string,
        status as string,
        limitNumber,
      );

      return res.status(200).json({
        message: 'Report generated successfully',
        status: 200,
        ...result,
      });
    } catch (error) {
      if (error instanceof Error && (
        error.message.includes('Invalid date') ||
        error.message.includes('startDate must be')
      )) {
        return res.status(400).json({
          message: error.message,
          status: 400,
        });
      }

      console.error('Error generating report:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
