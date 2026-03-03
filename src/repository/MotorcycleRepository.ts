import { Repository } from 'typeorm';
import { dataSource } from '../../config/database/data-source';
import { Motorcycle } from '../entity/Motorcycle';

export class MotorcycleRepository {
  private repository: Repository<Motorcycle>;

  constructor() {
    this.repository = dataSource.getRepository(Motorcycle);
  }

  async findById(id: string): Promise<Motorcycle | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['client'],
    });
  }
}
