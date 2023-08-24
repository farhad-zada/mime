const Session = require('../../models/sessionModel')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')
const createSession = require('./createSession')

module.exports = catchAsync(async (req, res, next) => {
  const session = await req.session.people.push({
    user_id: req.user.id,
  })
  res.status(200).json({ session })
})
