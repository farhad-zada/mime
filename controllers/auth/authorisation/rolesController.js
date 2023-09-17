const User = require('../../../models/userModel')
const AppError = require('../../../utils/appError')
const catchAsync = require('../../../utils/catchAsync')

// TODO: delete these in deployment because it may be a security vulnerablity

exports.addRole = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId)
  if (!user) {
    return next(new AppError('User not found!', 400))
  }

  const { role } = req.body

  console.log(role)
  console.log(user.role)
  user.role.push(role)
  console.log(user.role)

  console.log(user)
  let new_user
  try {
    new_user = await user.save({
      validateBeforeSave: false,
    })
  } catch (e) {
    console.log(e)
  }
  console.log(user)
  console.log(new_user)

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  })
})

exports.userRoles = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId)
  if (!user) {
    return next(new AppError('User not found!', 400))
  }

  res.status(200).json({
    status: 'success',
    data: {
      roles: user.role,
      user,
    },
  })
})
