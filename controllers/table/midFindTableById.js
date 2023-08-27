const Table = require(`../../models/tableModel`)
const AppError = require('../../utils/appError')
const catchAsync = require(`../../utils/catchAsync`)

//TEST:

// Get a Single Table

module.exports = catchAsync(async (req, res, next) => {
  const table = Table.findById(req.params.tableId)
  if (!table) {
    return next(new AppError('Invalid table ID.'))
  }
  req.table = table
  next()
})
