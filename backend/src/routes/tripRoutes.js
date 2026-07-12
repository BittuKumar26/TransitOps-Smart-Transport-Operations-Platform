import { Router } from 'express';
import { cancelTrip, completeTrip, createTrip, deleteTrip, dispatchTrip, getTripById, listTrips, updateTrip } from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', listTrips);
router.get('/:id', getTripById);
router.post('/', authorizeRoles('Admin', 'Dispatcher'), createTrip);
router.put('/:id', authorizeRoles('Admin', 'Dispatcher'), updateTrip);
router.delete('/:id', authorizeRoles('Admin', 'Dispatcher'), deleteTrip);
router.patch('/:id/dispatch', authorizeRoles('Admin', 'Dispatcher'), dispatchTrip);
router.patch('/:id/complete', authorizeRoles('Admin', 'Dispatcher'), completeTrip);
router.patch('/:id/cancel', authorizeRoles('Admin', 'Dispatcher'), cancelTrip);

export default router;
