const mongoose = require('mongoose');

const validateRestaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A restaurant needs to have a name.'],
  },
  voenImageFront: {
    type: String,
    required: [true, 'Front view of Voen'],
  },
  voenImageBack: {
    type: String,
    required: [true, 'Back view of Vöen'],
  },
  ibanProps: [String],
});

const ValidateRestaurant = mongoose.model('ValidateRestaurant', validateRestaurantSchema);

module.exports = ValidateRestaurant;
