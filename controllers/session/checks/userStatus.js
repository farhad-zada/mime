const catchAsync = require('../../../utils/catchAsync')
const AppError = require('../../../utils/appError')

module.exports = catchAsync(async (req, res, next) => {
  if (req.user['on_session']) {
    return next(
      new AppError(
        'Already on an active session. Only one session can be praticipated at a time.',
      ),
    )
  }
  next()
})
