import { Router } from 'express';
import { createFuelLog, deleteFuelLog, listFuelLogs } from '../controllers/fuelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', listFuelLogs);
router.post('/', createFuelLog);
router.delete('/:id', deleteFuelLog);

export default router;
