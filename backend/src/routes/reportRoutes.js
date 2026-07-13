import { Router } from 'express';
import { exportReportCsv, getReports } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getReports);
router.get('/csv', protect, exportReportCsv);

export default router;
