import { Request, Response } from 'express';
import { MechanicService } from '../service/MechanicService';

export class MechanicController {
  private service: MechanicService;

  constructor() {
    this.service = new MechanicService();
  }

  public async getAll(req: any, res: Response): Promise<Response> {
    try {
      const mechanics = await this.service.getAll();
      return res.status(200).json({
        message: 'Mechanics retrieved successfully',
        status: 200,
        data: mechanics,
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
      const { name } = req.query;

      if (!name) {
        return res.status(400).json({
          message: 'Name is required for search',
          status: 400,
        });
      }

      const mechanics = await this.service.searchByName(name);
      return res.status(200).json({
        message: 'Mechanics found',
        status: 200,
        data: mechanics,
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
