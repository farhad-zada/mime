const Restaurant = require('../../models/restaurantModel')
const APIFeatures = require(`${__dirname}/../../utils/apiFeatures`)
const catchAsync = require(`${__dirname}/../../utils/catchAsync`)

module.exports = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      restaurant: req.restaurant,
    },
  })
})
