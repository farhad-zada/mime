const catchAsync = require('../../utils/catchAsync')
const createSession = require('./createSession')
const joinSession = require('./joinSession')

// DONE

module.exports = catchAsync(async (req, res, next) => {
  //
  if (req.table.status === 'available') {
    createSession(req, res, next)
  } else if (req.table.status === 'on_session') {
    joinSession(req, res, next)
  }
})
