//TODO: to be implemented

/**
 * Create a payment checkout and
 */

const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')

module.exports = catchAsync(async (req, res, next) => {
  //TODO: put your code here. And if needed to another file please contact me on whatsapp and let me know it too.
  // Good luck Elmir!

  return next(
    new AppError(
      'This route not been implemented yet',
      400,
    ),
  )
})
