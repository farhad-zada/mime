// TODO:

const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')

module.exports = catchAsync(async (req, res, next) => {
  return next(
    new AppError(
      'This functionality have not been implemented yet!',
      401,
    ),
  )
})
