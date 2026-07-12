import { Router } from 'express';
import { createExpense, deleteExpense, listExpenses } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', listExpenses);
router.post('/', authorizeRoles('Admin', 'Financial Analyst'), createExpense);
router.delete('/:id', authorizeRoles('Admin', 'Financial Analyst'), deleteExpense);

export default router;
