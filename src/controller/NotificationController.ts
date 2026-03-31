import { Response } from 'express';
import { NotificationService } from '../service/NotificationService';

export class NotificationController {
  private service: NotificationService;

  constructor() {
    this.service = new NotificationService();
  }

  public async create(req: any, res: Response): Promise<Response> {
    try {
      const { serviceOrderId, clientName, clientPhone, message, daysToNotify, notifyDate } = req.body;

      if (!serviceOrderId || !clientName || !clientPhone || !message || !daysToNotify) {
        return res.status(400).json({
          message: 'serviceOrderId, clientName, clientPhone, message e daysToNotify são obrigatórios',
          status: 400,
        });
      }

      const userCreateId: string = req.user?.id;
      const userCreateName: string = req.user?.name;

      if (!userCreateId || !userCreateName) {
        return res.status(401).json({ message: 'Usuário não autenticado', status: 401 });
      }

      // Se notifyDate não for informado, calcula a partir de hoje + daysToNotify
      const toDateStr = (d: Date): string =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      const resolvedNotifyDate: any = notifyDate
        ? notifyDate.substring(0, 10)
        : toDateStr(new Date(Date.now() + Number(daysToNotify) * 86400000));

      const notification = await this.service.create({
        serviceOrderId,
        clientName,
        clientPhone,
        message,
        daysToNotify: Number(daysToNotify),
        notifyDate: resolvedNotifyDate,
        userCreateId,
        userCreateName,
      });

      return res.status(201).json({
        message: 'Notification created successfully',
        status: 201,
        data: notification,
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : 'Internal server error',
        status: 500,
      });
    }
  }

  public async getAll(req: any, res: Response): Promise<Response> {
    try {
      const notifications = await this.service.getAll();
      return res.status(200).json({
        message: 'Notifications retrieved successfully',
        status: 200,
        data: notifications,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
  }

  public async markAsDone(req: any, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const userDoneId: string = req.user?.id;
      const userDoneName: string = req.user?.name;

      if (!userDoneId || !userDoneName) {
        return res.status(401).json({ message: 'Usuário não autenticado', status: 401 });
      }

      const notification = await this.service.markAsDone(id, userDoneId, userDoneName);
      return res.status(200).json({
        message: 'Notification marked as done',
        status: 200,
        data: notification,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Notification not found') {
        return res.status(404).json({ message: 'Notification not found', status: 404 });
      }
      if (error instanceof Error && error.message === 'Notificação já foi concluída') {
        return res.status(409).json({ message: error.message, status: 409 });
      }
      console.error('Error marking notification as done:', error);
      return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
  }

  public async delete(req: any, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      await this.service.delete(id);
      return res.status(200).json({
        message: 'Notification deleted successfully',
        status: 200,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Notification not found') {
        return res.status(404).json({ message: 'Notification not found', status: 404 });
      }
      console.error('Error deleting notification:', error);
      return res.status(500).json({ message: 'Internal server error', status: 500 });
    }
  }
}
