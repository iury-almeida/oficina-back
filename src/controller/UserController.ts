import { Request, Response } from 'express';
import { UserService } from '../service/UserService';

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

   public async login(req: any, res: Response): Promise<Response> {
    try {
      const { cpf, password } = req.query;

      if (!cpf || !password) {
        return res.status(400).json({
          message: 'CPF and password are required',
        });
      }

      const result = await this.service.login(cpf, password);

      return res.status(200).json({
        message: 'Login successful',
        status: 200,
        token: result.token,
        // user: result.user,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        return res.status(401).json({
          message: 'Access denied - Invalid credentials',
        });
      }

      if (error instanceof Error && error.message === 'JWT_SECRET is not configured') {
        return res.status(500).json({
          message: 'Server configuration error',
        });
      }

      if (error instanceof Error && error.message === 'CPF and password are required') {
        return res.status(400).json({
          message: error.message,
        });
      }

      console.error('Login error:', error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '10' } = req.query;
      const pageNumber = parseInt(page as string, 10) || 1;
      const limitNumber = parseInt(limit as string, 10) || 10;

      const result = await this.service.getAll(pageNumber, limitNumber);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching users',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.service.getById(id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { cpf, password, name, telephone, endereco, cep, active, adm } = req.body ;

      if (!cpf || !password || !name || !telephone) {
        res.status(400).json({
          message: 'Missing required fields: email, password, name, telephone'
        });
        return;
      }

      const user = await this.service.create({
        cpf,
        passwordHash: password,
        name,
        telephone,
        endereco,
        cep,
        active,
        adm
      });

      res.status(201).json({
        message: 'User created successfully',
        user
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error creating user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { password, ...data } = req.body;

      // Se houver password, converte para passwordHash
      if (password) {
        data.passwordHash = password;
      }

      const user = await this.service.update(id, data);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json({
        message: 'User updated successfully',
        user
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.service.delete(id);

      if (!deleted) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async search(req: Request, res: Response): Promise<void> {
    try {
      const { q, page = '1', limit = '10' } = req.query;

      if (!q || typeof q !== 'string' || q.trim() === '') {
        res.status(400).json({
          message: 'Search query (q) is required',
          status: 400,
        });
        return;
      }

      const pageNumber = parseInt(page as string, 10) || 1;
      const limitNumber = parseInt(limit as string, 10) || 10;

      const result = await this.service.search(q, pageNumber, limitNumber);
      res.status(200).json({
        message: 'Users found',
        status: 200,
        ...result,
      });
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({
        message: 'Internal server error',
        status: 500,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
