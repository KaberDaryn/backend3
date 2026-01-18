const mongoose = require('mongoose');

// Primary Object (complex enough for beginner): ParkingLot
// Required: name + at least two more required fields + timestamps

const parkingLotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    pricePerHour: {
      type: Number,
      required: true,
      min: 0
    },
    totalSpots: {
      type: Number,
      required: true,
      min: 1
    },
    hasCCTV: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ParkingLot', parkingLotSchema);
