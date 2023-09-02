const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')
const SessionRequest = require('../../models/sessionJoinRequestModel')
const User = require('../../models/userModel')

// DONE

module.exports = catchAsync(async (req, res, next) => {
  //

  //TODO: test this
  if (req.sessionRequest.at < Date.now() - 10 * 60 * 1000) {
    // Checks if the request is not sent before 10 minutes
    return next(new AppError('The request expired.', 400))
  }

  const requestSender = await User.findById(
    // Finds the user who has sent the request to join the session
    req.sessionRequest.user,
  )

  if (requestSender.on_session) {
    // Checks if the request sender user is not already on another session
    return next(
      new AppError('User already on a session!', 400),
    )
  }

  if (req.session.finished) {
    // Checks if the session is not already finished
    return next(new AppError('Session already ended.', 400))
  }

  if (req.user.id !== req.session.session_admin) {
    // Checks if the user who wants to accept the request sender into the session indeed is the session admin
    return next(
      new AppError(
        'You are not allowed to proceed this action.',
        401,
      ),
    )
  }

  req.session.people.push(req.session.user)

  results = await Promise.all([
    req.session.save(),
    req.sessionRequest.delete(),
  ]) // TODO: test

  //TODO: test this too

  res.status(200).json({
    status: 'success',
    data: {
      session: results[0],
    },
  })
})
