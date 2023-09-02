const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')
const SessionRequest = require('../../models/sessionJoinRequestModel')
const deleteExpiredSessionRequests = require('./deleteExpiredSessionRequests')

// DONE

module.exports = catchAsync(async (req, res, next) => {
  const sessionRequest = await SessionRequest.create({
    session: req.table.session,
    table: req.table.id,
    user: req.user.id,
    restaurant: req.restaurant.id,
  })

  if ((Date.now() % 10) * 60 * 1000) {
    // TODO: handle deleteing all the requests that expired already
    deleteExpiredSessionRequests() // not handled yet
    // REMEMBER: this is an async fundtion which means it does not affect workflow of this function
  }

  if (!sessionRequest) {
    return next(new AppError('Something went wrong!', 400))
  }

  res.status(200).json({
    status: 'success',
    data: { sessionRequest },
  })
})
