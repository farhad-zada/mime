const TransferSessionAdminship = require('../../models/transferSessionAdminshipModel')
const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')

module.exports = catchAsync(async (req, res, next) => {
  const transferRequest = TransferSessionAdminship.findById(
    req.body.requestId,
  )

  if (!transferRequest) {
    return next(new AppError('Reuqest ID not found!', 400))
  }

  if (req.user.id !== transferRequest.new_admin) {
    return next(
      new AppError(
        'You are not allowed to accept this request!',
        403,
      ),
    )
  }

  if (
    req.session.session_admin !==
    transferRequest.current_admin
  ) {
    return next(
      new AppError(
        'Session adminship have already been transfered!',
        400,
      ),
    )
  }

  if (transferRequest.at < Date.now() - 10 * 60 * 1000) {
    return next(
      new AppError('Request expired already!', 403),
    )
  }

  req.session.session_admin = req.user.id
  transferRequest.status = req.body.status

  const result = await Promise.all([
    req.session,
    transferRequest,
  ])

  res.status(200).json({
    status: 'success',
    data: {
      result: result[1],
    },
  })
})
