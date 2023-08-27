const Session = require('../../models/sessionModel')
const catchAsync = require('../../utils/catchAsync')
const sessionUpdates = require('./updates/index')

//TEST: this
module.exports = catchAsync(async (req, res, next) => {
  //
  req.user = sessionUpdates.updateUser(req.user, true) // Update user's session status to true
  req.table['status'] = sessionUpdates.updateTable(
    req.table,
    'on_session',
  ) // Update table's status to on_session

  await Promise.all([req.user, req.table]) // Here we wait both to be set

  const session = await Session.create({
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

  res.status(200).json({
    status: 'success',
    data: {
      session,
    },
  })
})
