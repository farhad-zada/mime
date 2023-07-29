const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')

const User = require(`${__dirname}/../models/userModel`)
//TODO: Restrict password hash to be not sent back

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  }
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

exports.signup = catchAsync(async (req, res, next) => {
  const creds = ({ name, password, passwordConfirm, email } = req.body)

  const newUser = await User.create(creds)

  if (!newUser) {
    res.status(404).json({
      status: 'fail',
      message: 'Something went wrong',
    })
  }

  newUser.password = undefined
  res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  })
})

exports.login = catchAsync(async (req, res, next) => {
  // 1. Check if password and email provided
  const { email, password } = req.body

  if (!email || !password)
    return next(new AppError('Please, provide email and password.', 404))

  // 2. Check if user exists
  const user = await User.findOne({ email }).select('+password')

  if (!user)
    return next(new AppError('User bot found. Please enter a signed email.'))

  createSendToken(user, 200, res)
})

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 3600 * 1000,
    ),
    httpOnly: true,
  })

  res.status(200).json({
    status: 'success',
  })
}

// TODO: protect
// TODO: restrictTo
// TODO: isLoggedIn
