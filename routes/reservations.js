const express = require('express');
const mongoose = require('mongoose');

const Reservation = require('../models/Reservation');
const ParkingLot = require('../models/ParkingLot');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

function validateReservation(body) {
  const errors = [];

  if (!body.parkingLotId || !mongoose.Types.ObjectId.isValid(body.parkingLotId)) {
    errors.push('parkingLotId is required (valid ObjectId)');
  }

  if (!body.customerName || typeof body.customerName !== 'string') {
    errors.push('customerName is required (string)');
  }

  if (!body.carPlate || typeof body.carPlate !== 'string') {
    errors.push('carPlate is required (string)');
  }

  if (!body.startTime) {
    errors.push('startTime is required (ISO date string)');
  }

  if (!body.endTime) {
    errors.push('endTime is required (ISO date string)');
  }

  const start = new Date(body.startTime);
  const end = new Date(body.endTime);

  if (String(start) === 'Invalid Date') {
    errors.push('startTime is invalid date');
  }

  if (String(end) === 'Invalid Date') {
    errors.push('endTime is invalid date');
  }

  if (String(start) !== 'Invalid Date' && String(end) !== 'Invalid Date' && end <= start) {
    errors.push('endTime must be after startTime');
  }

  return { errors, start, end };
}

function calcTotalPrice(start, end, pricePerHour) {
  const ms = end - start;
  const hours = ms / (1000 * 60 * 60);

  // beginner billing: always round UP to whole hours
  const billableHours = Math.ceil(hours);

  return billableHours * pricePerHour;
}

// POST /api/reservations
router.post('/', async (req, res, next) => {
  try {
    const { errors, start, end } = validateReservation(req.body);
    if (errors.length) {
      return res.status(400).json({ message: 'Validation error', errors });
    }

    const lot = await ParkingLot.findById(req.body.parkingLotId);
    if (!lot) {
      return res
        .status(404)
        .json({ message: 'Parking lot not found for this parkingLotId' });
    }

    const totalPrice = calcTotalPrice(start, end, lot.pricePerHour);

    const reservation = await Reservation.create({
      parkingLotId: lot._id,
      customerName: req.body.customerName.trim(),
      carPlate: req.body.carPlate.trim().toUpperCase(),
      startTime: start,
      endTime: end,
      totalPrice
    });

    return res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
});

// GET /api/reservations
router.get('/', async (req, res, next) => {
  try {
    const list = await Reservation.find()
      .populate('parkingLotId', 'name address pricePerHour')
      .sort({ createdAt: -1 });

    return res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/reservations/:id
router.get('/:id', validateObjectId, async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate(
      'parkingLotId',
      'name address pricePerHour'
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    return res.json(reservation);
  } catch (err) {
    next(err);
  }
});

// PUT /api/reservations/:id
router.put('/:id', validateObjectId, async (req, res, next) => {
  try {
    const { errors, start, end } = validateReservation(req.body);
    if (errors.length) {
      return res.status(400).json({ message: 'Validation error', errors });
    }

    const lot = await ParkingLot.findById(req.body.parkingLotId);
    if (!lot) {
      return res
        .status(404)
        .json({ message: 'Parking lot not found for this parkingLotId' });
    }

    const totalPrice = calcTotalPrice(start, end, lot.pricePerHour);

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        parkingLotId: lot._id,
        customerName: req.body.customerName.trim(),
        carPlate: req.body.carPlate.trim().toUpperCase(),
        startTime: start,
        endTime: end,
        totalPrice
      },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    return res.json(reservation);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/reservations/:id
router.delete('/:id', validateObjectId, async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
