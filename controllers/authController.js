const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
require('dotenv').config()
const User = require(`${__dirname}/../models/userModel`)
const Restaurant = require(`${__dirname}/../models/restaurantModel`)
const crypto = require('crypto')
const sendEmail = require('../utils/sendMail')
const { v4: uuidv4 } = require('uuid')

const validator = require('validator')

const signToken = (id) => {
  let x = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.JWT_COOKIE_EXPIRES *
          24 *
          60 *
          60 *
          1000,
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
  const { name, password, passwordConfirm, email } =
    req.body
  const token = uuidv4().replace(/-/g, '').substr(0, 256)

  const newUser = await User.create({
    name,
    password,
    passwordConfirm,
    email,
    token,
  })

  if (!newUser) {
    return res.status(500).json({
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

  const emailSubject =
    'Please Verify your email for be safe mime user'

  const emailHTML = `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        text-align: center;
        padding: 20px;
      }
      h2 {
        color: #333;
      }
      p {
        margin: 10px 0;
      }
    </style>
  </head>
  <body>
    <h2>Verify email</h2>
    <p>You can use this link for verify your accaount</p>
    <p class="verification-code"><a href="http://localhost:3000/app/v1/verifyEmail/${token}">http://localhost:3000/app/v1/verifyEmail/${token}<a></p>
  <img src="https://static.vecteezy.com/system/resources/thumbnails/022/645/609/small/skull-devil-cyborg-samurai-face-3d-rendering-generate-ai-photo.jpeg" alt="">
  
  </body>
  </html>
  `

  sendEmail(email, emailSubject, emailHTML)
})

exports.login = catchAsync(async (req, res, next) => {
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

  createSendToken(user, 200, res)
})

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(
      Date.now() +
        process.env.JWT_COOKIE_EXPIRES * 24 * 3600 * 1000,
    ),
    httpOnly: true,
  })

  res.status(200).json({
    status: 'success',
  })
}

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { verifyToken } = req.params

  console.log(verifyToken)
  const user = await User.findOne({ token: verifyToken })
  console.log(user)
  if (user) {
    console.log(user)
    user.verify = true
    await user.save()
  } else {
    console.log('User not found')
  }
})

exports.authed = catchAsync(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in. To continue please log in.',
        403,
      ),
    )
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  )

  const user = await User.findById(decoded.id)

  if (!user) {
    return next(
      new AppError(
        'Incorrect credidentials. Please, log in with a valid account.',
        401,
      ),
    )
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User credidentials expired. Please, log in again.',
        401,
      ),
    )
  }

  req.user = user
  next()
})

exports.restrict = (...roles) => {
  return (req, res, next) => {
    // If the role of the user not allowed to reach this branch throw an error
    if (!roles.includes(req.user.role)) {
      console.log(req.user.role)
      return next(
        new AppError('Something went wrong!', 403),
      )
    }
    // Else allow to continue
    next()
  }
}

exports.forgotPassword = catchAsync(
  async (req, res, next) => {
    const { email } = req.body
    if (!email) {
      return next(
        new AppError(
          'Request needs to include email at body.',
          400,
        ),
      )
    }

    if (!validator.isEmail(email)) {
      return next(new AppError('Invalid email!', 400))
    }

    const user = await User.findOne({ email })

    const resetToken = user.createPasswordResetToken()

    await user.save({ validateBeforeSave: false })

    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/app/v1/user/resetPassword/${resetToken}`

    res.json({ status: 'success', data: { resetUrl } })

    //TODO: add email here
  },
)

exports.resetPassword = catchAsync(
  async (req, res, next) => {
    const { token } = req.params
    const { password, passwordConfirm } = req.body

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')
    const user = await User.findOne({
      passwordResetToken: hashedToken,
    })

    if (!password || !passwordConfirm) {
      return next(
        new AppError(
          'Please, enter your password and confirmation of the password',
          400,
        ),
      )
    }
    user.password = password
    user.passwordConfirm = passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()

    createSendToken(user, 200, res)
  },
)

exports.updatePassword = catchAsync(
  async (req, res, next) => {
    const { currentPassword, password, passwordConfirm } =
      req.body

    const user = await User.findById(req.user.id).select(
      '+password',
    )

    if (
      !(await user.correctPassword(
        currentPassword,
        user.password,
      ))
    ) {
      return next(
        new AppError(
          'Your current password is incorrect. Please, try again.',
          400,
        ),
      )
    }

    if (!(password && passwordConfirm)) {
      return next(
        new AppError(
          'Please, enter your password and password confirmation.',
          400,
        ),
      )
    }

    req.user.password = password
    req.user.passwordConfirm = passwordConfirm
    await req.user.save()

    createSendToken(req.user, 200, res)
  },
)

exports.restaurantOwner = catchAsync(
  async (req, res, next) => {
    const restaurant = await Restaurant.findById(
      req.params.restaurantId,
    )
    if (restaurant.owner != req.user.id) {
      return next(
        new AppError('Not owner of the restaurant', 403),
      )
    }

    req.restaurant = restaurant
    next()
  },
)
