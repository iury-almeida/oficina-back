import { Request, Response } from 'express';
import { ServiceOrderService } from '../service/ServiceOrderService';

export class ServiceOrderController {
  private service: ServiceOrderService;

  constructor() {
    this.service = new ServiceOrderService();
  }

  public async getAll(req: any, res: Response): Promise<Response> {
    try {
      const { page = '1', limit = '10' } = req.query;
      const pageNumber = parseInt(page as string, 10) || 1;
      const limitNumber = parseInt(limit as string, 10) || 10;

      const serviceOrders = await this.service.getAll(pageNumber, limitNumber);
      return res.status(200).json({
        message: 'Service orders retrieved successfully',
        status: 200,
        ...serviceOrders,
      });
    } catch (error) {
      console.error('Error fetching service orders:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // public async getFilteredList(req: any, res: Response): Promise<Response> {
  //   try {
  //     const { page = '1', limit = '10', status } = req.query;
  //     const pageNumber = parseInt(page as string, 10) || 1;
  //     const limitNumber = parseInt(limit as string, 10) || 10;
  //     const statusParam = Array.isArray(status)
  //       ? (status as string[]).join(',')
  //       : typeof status === 'string'
  //         ? status
  //         : undefined;

  //     const result = await this.service.getFilteredList(pageNumber, limitNumber, statusParam);
  //     return res.status(200).json({
  //       message: 'Service orders retrieved successfully',
  //       status: 200,
  //       ...result,
  //     });
  //   } catch (error) {
  //     console.error('Error fetching filtered service orders:', error);
  //     return res.status(500).json({
  //       message: 'Internal server error',
  //       status: 500,
  //       error: error instanceof Error ? error.message : 'Unknown error',
  //     });
  //   }
  // }

  public async getById(req: any, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: 'Service order ID is required',
          status: 400,
        });
      }

      const serviceOrder = await this.service.getById(id);
      return res.status(200).json({
        message: 'Service order retrieved successfully',
        status: 200,
        data: serviceOrder,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Service order not found') {
        return res.status(404).json({
          message: 'Service order not found',
          status: 404,
        });
      }

      console.error('Error fetching service order:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
      });
    }6
  }

  public async create(req: any, res: Response): Promise<Response> {
    try {
      const { client, motorcycle, serviceType, status, mechanic, budgetNumber, pac, dcm, laborCost } = req.body;

      if (!client?.id || !motorcycle?.id || !serviceType || !mechanic?.id || !pac || !laborCost) {
        return res.status(400).json({
          message: 'Cliente, Moto, TipoServico, Mecanico, PAC and LaborCost are required',
          status: 400,
        });
      }

      const serviceOrderData = {
        client: { id: client.id },
        motorcycle: { id: motorcycle.id },
        serviceType: serviceType,
        status: status || 'Aguardando:Vermelho',
        mechanic: { id: mechanic.id },
        budgetNumber: budgetNumber !== undefined && budgetNumber !== null ? String(budgetNumber) : null,
        pac,
        dcm: dcm && dcm.length > 0 ? dcm : null,
        laborCost: laborCost !== undefined && laborCost !== null ? Number(laborCost) : 0,
      } as Partial<any>;

      const newServiceOrder = await this.service.create(serviceOrderData);
      return res.status(201).json({
        message: 'Service order created successfully',
        status: 201,
        data: newServiceOrder,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({
          message: error.message,
          status: 404,
        });
      }

      console.error('Error creating service order:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
      });
    }
  }

  public async update(req: any, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const photoBase64 = req.body.photoBase64 || null; 
      const { client, motorcycle, serviceType, status, mechanic, budgetNumber, pac, dcm, laborCost } = req.body;

      if (!id) {
        return res.status(400).json({
          message: 'Service order ID is required',
          status: 400,
        });
      }

      if (status === 'Concluído' && (photoBase64 === undefined || photoBase64 === null)) {
        return res.status(400).json({
          message: 'Photo is required when status is Concluído',
          status: 400,
        });
      }

      const updateData: any = {};
      if (client?.id !== undefined) updateData.client = { id: client.id };
      if (motorcycle?.id !== undefined) updateData.motorcycle = { id: motorcycle.id };
      if (serviceType !== undefined) updateData.serviceType = serviceType;
      if (status !== undefined) updateData.status = status;
      if (mechanic?.id !== undefined) updateData.mechanic = { id: mechanic.id };
      if (budgetNumber !== undefined && budgetNumber !== null) {
        updateData.budgetNumber = String(budgetNumber);
      }
      if (pac !== undefined) updateData.pac = pac;
      if (dcm !== undefined) updateData.dcm = dcm && dcm.length > 0 ? dcm : null;
      if (laborCost !== undefined && laborCost !== null) {
        updateData.laborCost = Number(laborCost);
      }

      const updatedServiceOrder = await this.service.update(id, updateData, photoBase64);
      return res.status(200).json({
        message: 'Service order updated successfully',
        status: 200,
        data: updatedServiceOrder,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Service order not found') {
        return res.status(404).json({
          message: 'Service order not found',
          status: 404,
        });
      }

      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({
          message: error.message,
          status: 404,
        });
      }

      console.error('Error updating service order:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
      });
    }
  }

  public async delete(req: any, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: 'Service order ID is required',
          status: 400,
        });
      }

      const success = await this.service.delete(id);
      if (!success) {
        return res.status(404).json({
          message: 'Service order not found',
          status: 404,
        });
      }

      return res.status(200).json({
        message: 'Service order deleted successfully',
        status: 200,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Service order not found') {
        return res.status(404).json({
          message: 'Service order not found',
          status: 404,
        });
      }

      console.error('Error deleting service order:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
      });
    }
  }
}
