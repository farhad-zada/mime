const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')
const SessionRequest = require('../../models/sessionJoinRequestModel')
const User = require('../../models/userModel')

// TODO: handle expiration and/or double join for user

module.exports = catchAsync(async (req, res, next) => {
  //
  const requestSender = await User.findById(
    req.sessionRequest.user,
  )

  if (requestSender.on_session) {
    return next(
      new AppError('User already on a session!', 400),
    )
  }

  if (req.session.finished) {
    return next(new AppError('Session already ended.', 400))
  }

  if (req.user.id !== req.session.session_admin) {
    return next(
      new AppError(
        'You are not allowed to proceed this action.',
        401,
      ),
    )
  }

  const sessionRequest = await SessionRequest.findById(
    req.params.sessionId,
  )

  if (!sessionRequest) {
    return next(
      new AppError('Invalid Session Request ID.', 401),
    )
  }
  req.session.people.push(sessionRequest.user)
  results = await Promise.all([
    req.session.save(),
    sessionRequest.delete(),
  ]) // TODO: test

  //TODO: test this too

  res.status(200).json({
    status: 'success',
    data: {
      session: results[0],
    },
  })
})
