import { Router } from 'express';
import { cancelTrip, completeTrip, createTrip, deleteTrip, dispatchTrip, getTripById, listTrips, updateTrip } from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', listTrips);
router.get('/:id', getTripById);
router.post('/', createTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.patch('/:id/dispatch', dispatchTrip);
router.patch('/:id/complete', completeTrip);
router.patch('/:id/cancel', cancelTrip);

export default router;
