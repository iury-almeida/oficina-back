import { Repository } from 'typeorm';
import { dataSource } from '../../config/database/data-source';
import { Notification, NotificationStatus } from '../entity/Notification';
import { ServiceOrder } from '../entity/ServiceOrder';

export class NotificationRepository {
  private repository: Repository<Notification>;

  constructor() {
    this.repository = dataSource.getRepository(Notification);
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    const notification = this.repository.create(data);
    const saved = await this.repository.save(notification);
    await dataSource.getRepository(ServiceOrder).update(data.serviceOrderId!, { hasNotification: true });
    return saved;
  }

  async findAll(): Promise<Notification[]> {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    return this.repository
      .createQueryBuilder('n')
      .where('n.status = :status', { status: 'pending' })
      .andWhere('n.notifyDate <= :today', { today: todayStr })
      .orderBy('n.notifyDate', 'ASC')
      .addOrderBy('n.createdAt', 'DESC')
      .getMany();
  }

  async findById(id: string): Promise<Notification | null> {
    return this.repository.findOne({ where: { id } });
  }

  async markAsDone(
    id: string,
    userDoneId: string,
    userDoneName: string,
  ): Promise<Notification | null> {
    await this.repository.update(id, {
      status: 'done',
      doneAt: new Date(),
      userDoneId,
      userDoneName,
    });
    return this.findById(id);
  }

  async existsByServiceOrderId(serviceOrderId: string): Promise<boolean> {
    const count = await this.repository.count({ where: { serviceOrderId } });
    return count > 0;
  }

  async delete(id: string): Promise<boolean> {
    const notification = await this.findById(id);
    const result = await this.repository.delete(id);
    if (notification?.serviceOrderId) {
      const remaining = await this.repository.count({ where: { serviceOrderId: notification.serviceOrderId } });
      if (remaining === 0) {
        await dataSource.getRepository(ServiceOrder).update(notification.serviceOrderId, { hasNotification: false });
      }
    }
    return (result.affected ?? 0) > 0;
  }
}
