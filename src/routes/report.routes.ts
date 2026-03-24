import { Router } from 'express';
import { ReportController } from '../controller/ReportController';
import { verifyJWT } from '../../config/middleware/jwtDecoder';

export const reportRouter = Router();
const controller = new ReportController();

// GET /report/service-orders?startDate=2026-01-01&endDate=2026-03-24&status=Concluído&limit=1000
reportRouter.get('/service-orders', verifyJWT, (req, res) => controller.getCompletedServiceOrders(req, res));
