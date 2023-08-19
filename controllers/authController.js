const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
require('dotenv').config()
const Restaurant = require(`${__dirname}/../models/restaurantModel`)

exports.signup = require(`${__dirname}/auth/signup`)
exports.login = require(`${__dirname}/auth/login`)
exports.logout = require(`${__dirname}/auth/logout`)
exports.verifyEmail = require(`${__dirname}/auth/verifyEmail`)
exports.authed = require(`${__dirname}/auth/authed`)
exports.restrict = require(`${__dirname}/auth/restrict`)
exports.forgotPassword = require(`${__dirname}/auth/forgotPassword`)
exports.resetPassword = require(`${__dirname}/auth/resetPassword`)
exports.updatePassword = require(`${__dirname}/auth/updatePassword`)

exports.restaurantOwner = catchAsync(
  async (req, res, next) => {
    const restaurant = await Restaurant.findById(
      req.params.restaurantId,
    )
    if (restaurant.owner != req.user.id) {
      return next(
        new AppError('Not owner of the restaurant', 403),
      )
    }

    req.restaurant = restaurant
    next()
  },
)
