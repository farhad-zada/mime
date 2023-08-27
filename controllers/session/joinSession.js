const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')
const SessionRequest = require('../../models/sessionJoinRequestModel')

module.exports = catchAsync(async (req, res, next) => {
  const sessionRequest = await SessionRequest.create({
    session: req.table.session,
    table: req.table.id,
    user: req.user.id,
    restaurant: req.restaurant.id,
  })

  if (!sessionRequest) {
    return next(new AppError('Something went wrong!', 400))
  }

  res.status(200).json({
    status: 'success',
    data: { sessionRequest },
  })
})
