import { Router } from 'express';
import { exportReportCsv, getReports } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', protect, authorizeRoles('Admin', 'Financial Analyst', 'Fleet Manager'), getReports);
router.get('/csv', protect, authorizeRoles('Admin', 'Financial Analyst', 'Fleet Manager'), exportReportCsv);

export default router;
