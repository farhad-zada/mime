const Session = require(`../../models/sessionModel`)
const AppError = require('../../utils/appError')
const catchAsync = require(`../../utils/catchAsync`)

//TEST:

// Get a Single Session By ID

module.exports = catchAsync(async (req, res, next) => {
  //
  const session = Session.findById(req.params.sessionId)
  if (!session) {
    return next(new AppError('Invalid Session ID.'))
  }
  req.session = session
  next()
})
