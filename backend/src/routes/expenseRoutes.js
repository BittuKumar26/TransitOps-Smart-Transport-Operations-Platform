import { Router } from 'express';
import { createExpense, deleteExpense, listExpenses } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', listExpenses);
router.post('/', createExpense);
router.delete('/:id', deleteExpense);

export default router;
