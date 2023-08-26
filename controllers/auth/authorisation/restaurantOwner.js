const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')

const Restaurant = require(`../../models/restaurantModel`)

require('dotenv').config()

module.exports = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(
    req.params.restaurantId,
  )
  if (restaurant.owner !== req.user.id) {
    return next(
      new AppError('Not owner of the restaurant', 403),
    )
  }

  req.restaurant = restaurant
  next()
})
