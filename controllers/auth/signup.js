const AppError = require(`${__dirname}/../utils/appError`)
const catchAsync = require('../utils/catchAsync')
require('dotenv').config()
const User = require(`${__dirname}/../models/userModel`)
const sendEmail = require('../utils/sendMail')
const verifyEmailForm = require(`${__dirname}/../HTMLs/verifyEmailForm`)

module.exports = catchAsync(async (req, res, next) => {
  const { name, password, passwordConfirm, email } =
    req.body

  const newUser = await User.create({
    name,
    password,
    passwordConfirm,
    email,
    verified: false,
  })

  if (!newUser) {
    return res.status(500).json({
      status: 'fail',
      message: 'Something went wrong',
    })
  }

  const verificationToken = newUser.createToken(
    'verificationToken',
  )

  newUser.password = undefined

  const emailSubject =
    'Please, verify your email to signup at MiME.'
  const url = `${req.protocol}://${req.get(
    'host',
  )}/app/v1/user/verifyEmail/${verificationToken}`
  const emailHTML = verifyEmailForm(url)

  const info = await sendEmail(
    email,
    emailSubject,
    emailHTML,
  )

  if (!info) {
    /**@dev In case user has already been created with email, we delete it.
     * Cause, one email can be used only once.
     */
    await User.findOneAndDelete({ email })
    return next(new AppError('Something went wrong!', 400))
  }

  res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  })
})
