import Expense from '../models/Expense.js';
import Vehicle from '../models/Vehicle.js';
import { sendSuccess } from '../utils/responseHandler.js';

const findExpenseByIdOrFail = async (id, res) => {
  const expense = await Expense.findById(id);

  if (!expense) {
    res.status(404).json({ message: 'Expense not found' });
    return null;
  }

  return expense;
};

export const listExpenses = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
    const skip = (page - 1) * limit;
    const type = (req.query.type || '').trim();

    const query = {};

    if (type) {
      query.type = { $regex: type, $options: 'i' };
    }

    const [expenses, totalCount] = await Promise.all([
      Expense.find(query).populate('vehicleId').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Expense.countDocuments(query)
    ]);

    res.setHeader('X-Page', String(page));
    res.setHeader('X-Limit', String(limit));
    res.setHeader('X-Total-Count', String(totalCount));
    sendSuccess(res, expenses);
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const { vehicleId, type, amount } = req.body;

    if (!type) {
      return res.status(400).json({ message: 'Expense type is required' });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ message: 'Expense amount must be greater than zero' });
    }

    if (vehicleId) {
      const vehicle = await Vehicle.findById(vehicleId);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
    }

    const expense = await Expense.create(req.body);
    sendSuccess(res, expense, 'Expense created', 201);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await findExpenseByIdOrFail(req.params.id, res);
    if (!expense) return;

    await expense.deleteOne();
    sendSuccess(res, null, 'Expense deleted');
  } catch (error) {
    next(error);
  }
};
