import { Repository } from 'typeorm';
import { dataSource } from '../../config/database/data-source';
import { User } from '../entity/User';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = dataSource.getRepository(User);
  }

  public async findUserByCpf(cpf: string): Promise<User | null> {
    try {
      const user = await this.repository
        .createQueryBuilder('user')
        .select('user.id', 'id')
        .addSelect('user.name', 'name')
        .addSelect('user.cpf', 'cpf')
        .addSelect('user.telephone', 'telephone')
        .addSelect('user.passwordHash', 'passwordHash')
        .addSelect('user.endereco', 'endereco')
        .addSelect('user.adm', 'adm')
        .addSelect('user.active', 'active')
        .addSelect('user.createdAt', 'createdAt')
        .addSelect('user.updatedAt', 'updatedAt')
        .where('user.cpf = :cpf', { cpf })
        .getRawOne();
      return user;
    } catch (error) {
      console.error('Error finding user by CPF:', error);
      throw new Error('Database error while searching for user');
    }
  }

  async findAll(): Promise<User[]> {
    return this.repository.find({
      select: ['id', 'cpf', 'name', 'telephone', 'endereco', 'cep', 'adm', 'active', 'createdAt', 'updatedAt']
    });
  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      select: ['id', 'cpf', 'name', 'telephone', 'endereco', 'cep', 'adm', 'active', 'createdAt', 'updatedAt'],
      skip,
      take: limit
    });

    return { data, total };
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      select: ['id', 'cpf', 'name', 'telephone', 'endereco', 'cep', 'adm', 'active', 'createdAt', 'updatedAt']
    });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
