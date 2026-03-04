import { Request, Response } from 'express';
import { ClientService } from '../service/ClientService';

export class ClientController {
  private service: ClientService;

  constructor() {
    this.service = new ClientService();
  }

  public async getAll(req: any, res: Response): Promise<Response> {
    try {
      const { page = '1', limit = '10' } = req.query;
      const pageNumber = parseInt(page as string, 10) || 1;
      const limitNumber = parseInt(limit as string, 10) || 10;

      const clients = await this.service.getAll(pageNumber, limitNumber);
      return res.status(200).json({
        message: 'Clients retrieved successfully',
        status: 200,
        ...clients,
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
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
          message: 'Client ID is required',
          status: 400,
        });
      }

      const client = await this.service.getById(id);
      return res.status(200).json({
        message: 'Client retrieved successfully',
        status: 200,
        data: client,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Client not found') {
        return res.status(404).json({
          message: 'Client not found',
          status: 404,
        });
      }

      console.error('Error fetching client:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
      });
    }
  }

  public async create(req: any, res: Response): Promise<Response> {
    try {
      const { name, telephone, cpf, address, cep, motorcycles } = req.body;

      if (!name || !telephone) {
        return res.status(400).json({
          message: 'Name and telephone are required',
          status: 400,
        });
      }

      const clientData = {
        name,
        telephone,
        cpf: cpf || null,
        address: address || null,
        cep: cep || null,
        motorcycles: motorcycles || [],
      };

      const newClient = await this.service.create(clientData);
      return res.status(201).json({
        message: 'Client created successfully',
        status: 201,
        data: newClient,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        return res.status(409).json({
          message: error.message,
          status: 409,
        });
      }

      console.error('Error creating client:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
      });
    }
  }

  public async update(req: any, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, telephone, cpf, address, cep, motorcycles } = req.body;

      if (!id) {
        return res.status(400).json({
          message: 'Client ID is required',
          status: 400,
        });
      }

      // Update scalar properties and motorcycles
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (telephone !== undefined) updateData.telephone = telephone;
      if (cpf !== undefined) updateData.cpf = cpf;
      if (address !== undefined) updateData.address = address;
      if (cep !== undefined) updateData.cep = cep;

      const updatedClient = await this.service.update(id, updateData);
      return res.status(200).json({
        message: 'Client updated successfully',
        status: 200,
        data: updatedClient,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Client not found') {
        return res.status(404).json({
          message: 'Client not found',
          status: 404,
        });
      }

      if (error instanceof Error && error.message.includes('already exists')) {
        return res.status(409).json({
          message: error.message,
          status: 409,
        });
      }

      console.error('Error updating client:', error);
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
          message: 'Client ID is required',
          status: 400,
        });
      }

      const success = await this.service.delete(id);
      if (!success) {
        return res.status(404).json({
          message: 'Client not found',
          status: 404,
        });
      }

      return res.status(200).json({
        message: 'Client deleted successfully',
        status: 200,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Client not found') {
        return res.status(404).json({
          message: 'Client not found',
          status: 404,
        });
      }

      console.error('Error deleting client:', error);
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

      const clients = await this.service.searchByName(name);
      return res.status(200).json({
        message: 'Clients found',
        status: 200,
        data: clients,
      });
    } catch (error) {
      console.error('Error searching clients:', error);
      return res.status(500).json({
        message: 'Internal server error',
        status: 500,
      });
    }
  }
}
