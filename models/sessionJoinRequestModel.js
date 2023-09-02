const mongoose = require('mongoose')

const schema = mongoose.Schema({
  session: {
    type: mongoose.Schema.ObjectId,
    ref: 'Session',
    required: [true, 'Session ID not provided'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User ID not found'],
  },
  table: {
    type: mongoose.Schema.ObjectId,
    ref: 'Table',
    required: [true, 'Table ID not found'],
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID not found'],
  },
  at: {
    type: Date,
    default: Date.now(),
  },
})

const SessionRequest = mongoose.model(
  'SessionRequest',
  schema,
)

module.exports = SessionRequest
