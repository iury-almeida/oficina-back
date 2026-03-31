import { Notification, NotificationStatus } from '../entity/Notification';
import { NotificationRepository } from '../repository/NotificationRepository';

export class NotificationService {
  private repository: NotificationRepository;

  constructor() {
    this.repository = new NotificationRepository();
  }

  public async create(data: {
    serviceOrderId: string;
    clientName: string;
    clientPhone: string;
    message: string;
    daysToNotify: number;
    notifyDate: string;
    userCreateId: string;
    userCreateName: string;
  }): Promise<Notification> {
    if (!data.serviceOrderId || !data.clientName || !data.clientPhone) {
      throw new Error('serviceOrderId, clientName e clientPhone são obrigatórios');
    }
    if (!data.message?.trim()) {
      throw new Error('A mensagem da notificação é obrigatória');
    }
    if (!data.daysToNotify || data.daysToNotify < 1) {
      throw new Error('daysToNotify deve ser no mínimo 1');
    }
    if (!data.userCreateId || !data.userCreateName) {
      throw new Error('Usuário autenticado é necessário para criar uma notificação');
    }

    return this.repository.create(data);
  }

  public async getAll(): Promise<Notification[]> {
    return this.repository.findAll();
  }

  public async markAsDone(
    id: string,
    userDoneId: string,
    userDoneName: string,
  ): Promise<Notification> {
    if (!id) throw new Error('Notification ID is required');
    if (!userDoneId || !userDoneName) {
      throw new Error('Usuário autenticado é necessário para concluir a notificação');
    }

    const notification = await this.repository.findById(id);
    if (!notification) throw new Error('Notification not found');
    if (notification.status === 'done') throw new Error('Notificação já foi concluída');

    const updated = await this.repository.markAsDone(id, userDoneId, userDoneName);
    return updated!;
  }

  public async delete(id: string): Promise<boolean> {
    if (!id) throw new Error('Notification ID is required');
    const exists = await this.repository.findById(id);
    if (!exists) throw new Error('Notification not found');
    return this.repository.delete(id);
  }
}
