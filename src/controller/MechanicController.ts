import { Request, Response } from 'express';
import { MechanicService } from '../service/MechanicService';

export class MechanicController {
  private service: MechanicService;

  constructor() {
    this.service = new MechanicService();
  }

  public async getAll(req: any, res: Response): Promise<Response> {
    try {
      const { page = '1', limit = '10' } = req.query;
      const pageNumber = parseInt(page as string, 10) || 1;
      const limitNumber = parseInt(limit as string, 10) || 10;

      const mechanics = await this.service.getAll(pageNumber, limitNumber);
      return res.status(200).json({
        message: 'Mechanics retrieved successfully',
        status: 200,
        ...mechanics,
      });
    } catch (error) {
      console.error('Error fetching mechanics:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
      });
    }
  }

  public async getById(req: any, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: 'Mechanic ID is required',
          status: 400,
        });
      }

      const mechanic = await this.service.getById(id);
      return res.status(200).json({
        message: 'Mechanic retrieved successfully',
        status: 200,
        data: mechanic,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Mechanic not found') {
        return res.status(404).json({
          message: 'Mechanic not found',
          status: 404,
        });
      }

      console.error('Error fetching mechanic:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
      });
    }
  }

  public async create(req: any, res: Response): Promise<Response> {
    try {
      const { name, telephone, cpf, address, status } = req.body;

      if (!name || !telephone) {
        return res.status(400).json({
          message: 'Name and telephone are required',
          status: 400,
        });
      }

      const mechanicData = {
        name,
        telephone,
        cpf: cpf || null,
        address: address || null,
        status: status !== undefined ? status : true,
        userCreateId: req.user?.id ?? null,
      };

      const newMechanic = await this.service.create(mechanicData);
      return res.status(201).json({
        message: 'Mechanic created successfully',
        status: 201,
        data: newMechanic,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        return res.status(409).json({
          message: error.message,
          status: 409,
        });
      }

      console.error('Error creating mechanic:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
      });
    }
  }

  public async update(req: any, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, telephone, cpf, address, status } = req.body;

      if (!id) {
        return res.status(400).json({
          message: 'Mechanic ID is required',
          status: 400,
        });
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (telephone !== undefined) updateData.telephone = telephone;
      if (cpf !== undefined) updateData.cpf = cpf;
      if (address !== undefined) updateData.address = address;
      if (status !== undefined) updateData.status = status;
      updateData.userUpdateId = req.user?.id ?? null;

      const updatedMechanic = await this.service.update(id, updateData);
      return res.status(200).json({
        message: 'Mechanic updated successfully',
        status: 200,
        data: updatedMechanic,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Mechanic not found') {
        return res.status(404).json({
          message: 'Mechanic not found',
          status: 404,
        });
      }

      if (error instanceof Error && error.message.includes('already exists')) {
        return res.status(409).json({
          message: error.message,
          status: 409,
        });
      }

      console.error('Error updating mechanic:', error);
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
          message: 'Mechanic ID is required',
          status: 400,
        });
      }

      const success = await this.service.delete(id);
      if (!success) {
        return res.status(404).json({
          message: 'Mechanic not found',
          status: 404,
        });
      }

      return res.status(200).json({
        message: 'Mechanic deleted successfully',
        status: 200,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Mechanic not found') {
        return res.status(404).json({
          message: 'Mechanic not found',
          status: 404,
        });
      }

      console.error('Error deleting mechanic:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
      });
    }
  }

  public async search(req: any, res: Response): Promise<Response> {
    try {
      const { q, page = '1', limit = '10' } = req.query;

      if (!q || typeof q !== 'string' || q.trim() === '') {
        return res.status(400).json({
          message: 'Search query (q) is required',
          status: 400,
        });
      }

      const pageNumber = parseInt(page as string, 10) || 1;
      const limitNumber = parseInt(limit as string, 10) || 10;

      const result = await this.service.search(q, pageNumber, limitNumber);
      return res.status(200).json({
        message: 'Mechanics found',
        status: 200,
        ...result,
      });
    } catch (error) {
      console.error('Error searching mechanics:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
      });
    }
  }
}
