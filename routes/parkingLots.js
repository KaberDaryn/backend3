const express = require('express');
const ParkingLot = require('../models/ParkingLot');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

function validateParkingLot(body) {
  const errors = [];

  if (!body.name || typeof body.name !== 'string') {
    errors.push('name is required (string)');
  }

  if (!body.address || typeof body.address !== 'string') {
    errors.push('address is required (string)');
  }

  const price = Number(body.pricePerHour);
  if (body.pricePerHour === undefined || Number.isNaN(price) || price < 0) {
    errors.push('pricePerHour is required (number >= 0)');
  }

  const total = Number(body.totalSpots);
  if (body.totalSpots === undefined || Number.isNaN(total) || total < 1) {
    errors.push('totalSpots is required (number >= 1)');
  }

  if (body.hasCCTV !== undefined && typeof body.hasCCTV !== 'boolean') {
    errors.push('hasCCTV must be boolean');
  }

  return errors;
}

// POST /api/parking-lots
router.post('/', async (req, res, next) => {
  try {
    const errors = validateParkingLot(req.body);
    if (errors.length) {
      return res.status(400).json({ message: 'Validation error', errors });
    }

    const lot = await ParkingLot.create({
      name: req.body.name.trim(),
      address: req.body.address.trim(),
      pricePerHour: Number(req.body.pricePerHour),
      totalSpots: Number(req.body.totalSpots),
      hasCCTV: req.body.hasCCTV ?? false
    });

    return res.status(201).json(lot);
  } catch (err) {
    next(err);
  }
});

// GET /api/parking-lots
router.get('/', async (req, res, next) => {
  try {
    const lots = await ParkingLot.find().sort({ createdAt: -1 });
    return res.json(lots);
  } catch (err) {
    next(err);
  }
});

// GET /api/parking-lots/:id
router.get('/:id', validateObjectId, async (req, res, next) => {
  try {
    const lot = await ParkingLot.findById(req.params.id);
    if (!lot) {
      return res.status(404).json({ message: 'Parking lot not found' });
    }

    return res.json(lot);
  } catch (err) {
    next(err);
  }
});

// PUT /api/parking-lots/:id
router.put('/:id', validateObjectId, async (req, res, next) => {
  try {
    const errors = validateParkingLot(req.body);
    if (errors.length) {
      return res.status(400).json({ message: 'Validation error', errors });
    }

    const lot = await ParkingLot.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name.trim(),
        address: req.body.address.trim(),
        pricePerHour: Number(req.body.pricePerHour),
        totalSpots: Number(req.body.totalSpots),
        hasCCTV: req.body.hasCCTV ?? false
      },
      { new: true, runValidators: true }
    );

    if (!lot) {
      return res.status(404).json({ message: 'Parking lot not found' });
    }

    return res.json(lot);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/parking-lots/:id
router.delete('/:id', validateObjectId, async (req, res, next) => {
  try {
    const lot = await ParkingLot.findByIdAndDelete(req.params.id);

    if (!lot) {
      return res.status(404).json({ message: 'Parking lot not found' });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
