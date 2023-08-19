const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require(`${__dirname}/../../models/userModel`)

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        // eslint-disable-next-line no-undef
        process.env.JWT_COOKIE_EXPIRES *
          24 *
          60 *
          60 *
          1000,
    ),
    httpOnly: true,
  }
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV == 'production') {
    cookieOptions.secure = true
  }

  res.cookie('jwt', token, cookieOptions)

  // Remove user password
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  })
}

module.exports = catchAsync(async (req, res, next) => {
  // 1. Check if password and email provided
  const { email, password } = req.body

  if (!email || !password)
    return next(
      new AppError(
        'Please, provide email and password.',
        404,
      ),
    )

  // 2. Check if user exists
  const user = await User.findOne({ email }).select(
    '+password',
  )

  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  )
    return next(
      new AppError('Incorrect email or password!', 400),
    )
  try {
    createSendToken(user, 200, res)
  } catch (err) {
    return next(new AppError('Something went wrong!', 403))
  }
})
