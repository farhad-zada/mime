//TODO: to be implemented

/**
 * Create a payment checkout and
 */

const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')

module.exports = catchAsync(async (req, res, next) => {
  return next(
    new AppError(
      'This route not been implemented yet',
      400,
    ),
  )
})
