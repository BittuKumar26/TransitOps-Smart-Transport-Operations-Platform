import { Router } from 'express';
import { closeMaintenance, createMaintenance, deleteMaintenance, listMaintenance } from '../controllers/maintenanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', listMaintenance);
router.post('/', createMaintenance);
router.patch('/:id/close', closeMaintenance);
router.delete('/:id', deleteMaintenance);

export default router;
