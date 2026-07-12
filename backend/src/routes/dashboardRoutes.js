import { Router } from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', protect, authorizeRoles('Admin', 'Fleet Manager', 'Dispatcher', 'Financial Analyst'), getDashboard);

export default router;
