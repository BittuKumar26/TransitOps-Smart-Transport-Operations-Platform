import Expense from '../models/Expense.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const listExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find().populate('vehicleId').sort({ createdAt: -1 });
    sendSuccess(res, expenses);
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create(req.body);
    sendSuccess(res, expense, 'Expense created', 201);
  } catch (error) {
    next(error);
  }
};
