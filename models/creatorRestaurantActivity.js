const mongoose = require('mongoose')

const schema = mongoose.Schema({
  validator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Validator not added!'],
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID not added'],
  },
  at: {
    type: Date,
    default: Date.now(),
  },
})

const RestaurantCreation = mongoose.model(
  'RestaurantValidation',
  schema,
)

module.exports = RestaurantCreation
