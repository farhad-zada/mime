const AppError = require('../../../utils/appError')
const catchAsync = require('../../../utils/catchAsync')

const Restaurant = require(`../../../models/restaurantModel`)

require('dotenv').config()

module.exports = catchAsync(async (req, res, next) => {
  if (!req.user.role.includes['creator-restaurant-mime']) {
    return next(new AppError('unauthorised', 403))
  }
  next()
})
