const Session = require('../../models/sessionModel')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')

//TEST: this
module.exports = catchAsync(async (req, res, next) => {
  const session = await Session.create({
    started: Date.now(),
    table: req.params.tableId, //TODO: update table status
    restaurant: req.params.restaurantId,
    session_admin: req.user.id,
    people: [
      {
        user_id: req.user.id, //TODO: update user status
        joined: Date.now(),
      },
    ],
  })

  res.status(200).json({
    status: 'success',
    data: {
      session,
    },
  })
})
