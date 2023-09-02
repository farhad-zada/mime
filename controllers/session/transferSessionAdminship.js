// TODO:

const TransferSessionAdminship = require('../../models/transferSessionAdminshipModel')
const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')

module.exports = catchAsync(async (req, res, next) => {
  if (req.user.id !== req.session.session_admin) {
    return next(new AppError('Something went wrnong!', 403))
  }

  const transferRequest =
    await TransferSessionAdminship.create({
      current_admin: req.session.session_admin,
      new_admin: req.body.new_admin,
      status: 'waiting',
    })

  res.status(200).json({
    status: 'success',
    data: {
      transfer_request: transferRequest,
    },
  })
})
