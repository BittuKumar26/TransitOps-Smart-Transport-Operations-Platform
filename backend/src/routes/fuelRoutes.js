import { Router } from 'express';
import { createFuelLog, deleteFuelLog, listFuelLogs } from '../controllers/fuelController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', listFuelLogs);
router.post('/', authorizeRoles('Admin', 'Financial Analyst'), createFuelLog);
router.delete('/:id', authorizeRoles('Admin', 'Financial Analyst'), deleteFuelLog);

export default router;
