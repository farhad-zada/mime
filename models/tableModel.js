const mongoose = require('mongoose')

// Chairs schema
const chairSchema = mongoose.Schema({
  usual: Number,
  extended: Number,
})

// Reserve Schema

const reserveSchema = mongoose.Schema({
  starts_at: {
    type: Date,
    validate: {
      validator: function (value) {
        // console.log(value)
        return value > Date.now()
      },
      message: 'Reservation date must be in the future.',
    },
    required: [
      true,
      'To reserve it needs to have a start time in future!',
    ],
  },
  ends_at: {
    type: Date,
    validate: {
      validator: function (value) {
        return value > this.starts_at
      },
      message:
        'Reservation end date can not be before start date.',
    },
  },
  number_ppl: Number,
  additional_request: {
    type: String,
    maxLength: [1000, 'Request limit is 1000 words'],
  },
})

const tableSchema = mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: function (value) {
        return (
          typeof value === 'string' ||
          typeof value === 'number'
        )
      },
      message: (props) =>
        `${props.value} is not a valid String or Number`,
    },
    required: [true, 'Each table must be named!'],
  },
  status: {
    type: String,
    enum: {
      values: [
        'on_session',
        'available',
        'reserved',
        'inactive',
      ],
      message: 'Status must be shown explicitly.',
    },
    default: 'available',
  },
  session: {
    type: mongoose.Schema.ObjectId,
    ref: 'Session',
  },
  chairs: chairSchema,
  reservation: reserveSchema,
  window_side: Boolean,
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
  },
  waiter: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  active: {
    type: Boolean,
  },
})

const Table = mongoose.model('Table', tableSchema)

module.exports = Table
