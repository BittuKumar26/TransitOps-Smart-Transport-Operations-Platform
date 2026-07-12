import { Router } from 'express';
import { createDriver, deleteDriver, getDriverById, listDrivers, updateDriver } from '../controllers/driverController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', listDrivers);
router.get('/:id', getDriverById);
router.post('/', authorizeRoles('Admin', 'Dispatcher', 'Safety Officer'), createDriver);
router.put('/:id', authorizeRoles('Admin', 'Dispatcher', 'Safety Officer'), updateDriver);
router.delete('/:id', authorizeRoles('Admin', 'Dispatcher'), deleteDriver);

export default router;
