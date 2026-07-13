import { Router } from 'express';
import { createDriver, deleteDriver, getDriverById, listDrivers, updateDriver } from '../controllers/driverController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', listDrivers);
router.get('/:id', getDriverById);
router.post('/', createDriver);
router.put('/:id', updateDriver);
router.delete('/:id', deleteDriver);

export default router;
