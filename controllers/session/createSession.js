const Session = require('../../models/sessionModel')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')

module.exports = catchAsync(async (req, res, next) => {
  console.log(req)
  const { user, restaurant, table } = req.body

  const session = await Session.create({
    started: Date.now(),
    table,
    restaurant,
    session_admin: user,
    people: [
      {
        user_id: user,
        joined: Date.now(),
      },
    ],
  })

  res.status(200).json({ session })
})
