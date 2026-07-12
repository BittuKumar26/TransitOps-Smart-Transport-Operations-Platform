import Driver from '../models/Driver.js';
import { sendSuccess } from '../utils/responseHandler.js';

const findDriverByIdOrFail = async (id, res) => {
  const driver = await Driver.findById(id);

  if (!driver) {
    res.status(404).json({ message: 'Driver not found' });
    return null;
  }

  return driver;
};

export const listDrivers = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
    const skip = (page - 1) * limit;
    const search = (req.query.search || '').trim();
    const status = (req.query.status || '').trim();

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }, { license: { $regex: search, $options: 'i' } }];
    }

    const [drivers, totalCount] = await Promise.all([
      Driver.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Driver.countDocuments(query)
    ]);

    res.setHeader('X-Page', String(page));
    res.setHeader('X-Limit', String(limit));
    res.setHeader('X-Total-Count', String(totalCount));
    sendSuccess(res, drivers);
  } catch (error) {
    next(error);
  }
};

export const createDriver = async (req, res, next) => {
  try {
    const existingDriver = await Driver.findOne({ license: req.body.license });

    if (existingDriver) {
      return res.status(400).json({ message: 'License already exists' });
    }

    const driver = await Driver.create(req.body);
    sendSuccess(res, driver, 'Driver created', 201);
  } catch (error) {
    next(error);
  }
};

export const getDriverById = async (req, res, next) => {
  try {
    const driver = await findDriverByIdOrFail(req.params.id, res);
    if (!driver) return;

    sendSuccess(res, driver);
  } catch (error) {
    next(error);
  }
};

export const updateDriver = async (req, res, next) => {
  try {
    const driver = await findDriverByIdOrFail(req.params.id, res);
    if (!driver) return;

    if (req.body.license && req.body.license !== driver.license) {
      const duplicateDriver = await Driver.findOne({ license: req.body.license });

      if (duplicateDriver) {
        return res.status(400).json({ message: 'License already exists' });
      }
    }

    Object.assign(driver, req.body);
    await driver.save();
    sendSuccess(res, driver, 'Driver updated');
  } catch (error) {
    next(error);
  }
};

export const deleteDriver = async (req, res, next) => {
  try {
    const driver = await findDriverByIdOrFail(req.params.id, res);
    if (!driver) return;

    await driver.deleteOne();
    sendSuccess(res, null, 'Driver deleted');
  } catch (error) {
    next(error);
  }
};
