const catchAsync = require('../utils/catchAsync')
require('dotenv').config()
const User = require(`${__dirname}/../models/userModel`)

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { verifyToken } = req.params

  const user = await User.findOne({ token: verifyToken })
  console.log(user)
  if (user) {
    user.verify = true
    await user.save()
  } else {
    //TODO: Handle this better
  }
})
