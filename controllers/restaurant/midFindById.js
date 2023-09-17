const Restaurant = require('../../models/restaurantModel')
const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')

module.exports = catchAsync(async (req, res, next) => {
  //
  const restaurant = await Restaurant.findById(
    req.params.restaurantId,
  )

  if (!restaurant) {
    return next(new AppError('Invalid restaurant ID.', 400))
  }
  req.restaurant = restaurant
  next()
})
