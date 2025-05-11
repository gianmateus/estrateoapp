import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { authMiddleware } from '../../../middlewares/authMiddleware';

const router = Router();
const reportController = new ReportController();

router.get('/reports', authMiddleware, reportController.generateReport);

export default router; 