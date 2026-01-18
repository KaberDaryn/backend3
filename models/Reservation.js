const mongoose = require('mongoose');

// Secondary Object (recommended): Reservation
// Shows relationship management (reservation belongs to a ParkingLot)

const reservationSchema = new mongoose.Schema(
  {
    parkingLotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingLot',
      required: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    carPlate: {
      type: String,
      required: true,
      trim: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
