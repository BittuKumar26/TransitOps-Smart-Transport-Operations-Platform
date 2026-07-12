import { Router } from 'express';
import { closeMaintenance, createMaintenance, deleteMaintenance, listMaintenance } from '../controllers/maintenanceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', listMaintenance);
router.post('/', authorizeRoles('Admin', 'Fleet Manager'), createMaintenance);
router.patch('/:id/close', authorizeRoles('Admin', 'Fleet Manager'), closeMaintenance);
router.delete('/:id', authorizeRoles('Admin', 'Fleet Manager'), deleteMaintenance);

export default router;
