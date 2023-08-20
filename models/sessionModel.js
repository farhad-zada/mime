const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  ordered_at: {
    type: Date,
  },
  required: [
    true,
    'Order`s made timestampt must be shown.',
  ],
  item: {
    type: mongoose.Schema.ObjectId,
    ref: 'Menu',
  },
  price: {
    type: Number,
    required: [true, 'Price of each order must be added.'],
  },
  served: {
    type: Boolean,
    default: false,
  },
  served_at: {
    type: Date,
  },
})

const peopleSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User ID must be added.'],
  },
  joined: {
    type: Date,
    default: Date.now(),
  },
  left: {
    type: Date,
  },
  orders: [orderSchema],
  total_bill: Number,
  total_paid: Number,
})

const sessionSchema = mongoose.Schema({
  table: {
    type: mongoose.Schema.ObjectId,
    ref: 'Table',
    required: [true, 'A session must belong to  a table.'],
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    requiree: [true, 'A Session must belong to a user.'],
  },
  started: {
    type: Date, // Timestamt (ts) shows when the session has started
    required: [true, 'Session`s start time must be shown.'],
  },
  ended: Date, // Timestampt shows when the session has been ended totally
  finished: Boolean, // This shows whether or not the session has already ended
  orders: [orderSchema],
  people: [peopleSchema],
  total_bill: Number,
  discount: Number,
  total_paid: Number,
  issues: Number,
})

const Session = mongoose.model(sessionSchema)

module.exports = Session
