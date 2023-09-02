const mongoose = require('mongoose')

const transferSessionAdminshipSchema = mongoose.Schema({
  current_admin: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Current admin ID not found!'],
  },
  new_admin: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'New admin ID not found!'],
  },
  at: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: {
      values: ['waiting', 'accepted', 'rejected!'],
      message: `Status must be one of 'waiting', 'accepted', 'rejected'`,
    },
    required: [true, 'Status not found!'],
  },
})

const TransferSessionAdminship = mongoose.model(
  'TransferSessionAdminship',
  transferSessionAdminshipSchema,
)

module.exports = TransferSessionAdminship
