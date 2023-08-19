const catchAsync = require('../../utils/catchAsync')
require('dotenv').config()
const User = require(`${__dirname}/../../models/userModel`)
const crypto = require('crypto')
const AppError = require(`../../utils/appError`)

module.exports = catchAsync(async (req, res, next) => {
  const verificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    verificationToken: verificationToken,
    verificationExpires: {
      $gte: new Date(),
    },
  })

  if (!user) {
    return next(
      new AppError('Invalid or expired verification link!'),
    )
  }
  user.verified = true
  user.verificationToken = undefined
  user.verificationExpires = undefined
  await user.save({ validateBeforeSave: false })

  res.status(200).json({
    status: 'success',
    user,
  })

  //TODO: Handle this better
})
