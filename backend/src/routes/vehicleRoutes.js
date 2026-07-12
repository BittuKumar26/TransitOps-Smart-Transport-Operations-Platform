import { Router } from 'express';
import { createVehicle, deleteVehicle, getVehicleById, listVehicles, updateVehicle } from '../controllers/vehicleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', listVehicles);
router.get('/:id', getVehicleById);
router.post('/', authorizeRoles('Admin', 'Fleet Manager'), createVehicle);
router.put('/:id', authorizeRoles('Admin', 'Fleet Manager'), updateVehicle);
router.delete('/:id', authorizeRoles('Admin', 'Fleet Manager'), deleteVehicle);

export default router;
