const Session = require('../../models/sessionModel')
const catchAsync = require('../../utils/catchAsync')

//TEST: this
module.exports = catchAsync(async (req, res, next) => {
  //
  req.user.on_session = true // Update user's session status to true

  req.table.status = 'on_session' // Update table's status to on_session

  const session = Session.create({
    started: Date.now(),
    table: req.params.tableId,
    restaurant: req.params.restaurantId,
    session_admin: req.user.id,
    people: [
      {
        user_id: req.user.id,
      },
    ],
  })

  result = await Promise.all([req.user, req.table, session]) // Here we wait both to be set

  res.status(200).json({
    status: 'success',
    data: {
      session: result[2],
    },
  })
})
