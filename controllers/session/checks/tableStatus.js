const catchAsync = require('../../../utils/catchAsync')
const AppError = require('../../../utils/appError')

module.exports = catchAsync(async (req, res, next) => {
  if (req.table['status'] !== 'available') {
    return next(
      new AppError(
        'Table not available to start a session!',
      ),
    )
  }
  next()
})
