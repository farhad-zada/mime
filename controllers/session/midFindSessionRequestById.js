const SessionRequest = require('../../models/sessionJoinRequestModel')
const AppError = require('../../utils/appError')
const catchAsync = require(`../../utils/catchAsync`)

//TEST:

// Get a Single Session By ID

module.exports = catchAsync(async (req, res, next) => {
  //
  const sessionRequest = SessionRequest.findById(
    req.params.sessionRequestId,
  )
  if (!sessionRequest) {
    return next(new AppError('Invalid Session ID.'))
  }
  req.sessionRequest = sessionRequest
  next()
})
