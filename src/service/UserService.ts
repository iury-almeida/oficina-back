import { User } from '../entity/User';
import { UserRepository } from '../repository/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface LoginResult {
  token: string;
}

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  public async login(cpf: string, password: string): Promise<LoginResult> {
    if (!cpf || !password) {
      throw new Error('CPF and password are required');
    }

    const user = await this.repository.findUserByCpf(cpf);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign(
      { 
        id: user.id,
        cpf: user.cpf,
        name: user.name,
        telephone: user.telephone,
        endereco: user.endereco,
        adm: user.adm,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      secret,
      { expiresIn: '24h' }
    );

    return {
      token
    };
  }

  async getAll(page: number, limit: number): Promise<{
    data: User[];
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
      totalPages: Math.ceil(total / limit)
    };
  }

  async getById(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async create(data: Partial<User>): Promise<User> {
    // Hash da senha se for fornecida
    if (data.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      data.passwordHash = await bcrypt.hash(data.passwordHash, salt);
    }
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    // Hash da senha se for fornecida na atualização
    if (data.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      data.passwordHash = await bcrypt.hash(data.passwordHash, salt);
    }
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
