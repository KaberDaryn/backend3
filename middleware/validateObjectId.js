const mongoose = require('mongoose');

// Very simple middleware to validate MongoDB ObjectId in :id
module.exports = function validateObjectId(req, res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }

  next();
};
