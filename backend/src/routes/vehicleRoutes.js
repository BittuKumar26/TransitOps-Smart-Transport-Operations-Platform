import { Router } from 'express';
import { createVehicle, deleteVehicle, getVehicleById, listVehicles, updateVehicle } from '../controllers/vehicleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', listVehicles);
router.get('/:id', getVehicleById);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;
