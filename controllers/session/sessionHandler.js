const Session = require('../../models/sessionModel')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')
const createSession = require('./createSession')
const joinSession = require('./joinSession')

module.exports = catchAsync(async (req, res, next) => {
  const { tableId, restaurantId } = req.params

  const session = await Session.findOne({
    table: tableId,
    restaurant: restaurantId,
    finished: false,
  })

  // Restrict double join to the same SESSION
  if (session.people.includes(req.user.id)) {
    return next(
      new AppError('You are already in this session!', 400),
    )
  }

  if (session) {
    joinSession(req, res, next)
  } else {
    createSession(req, res, next)
  }
})
