const Table = require(`${__dirname}/../../models/tableModel`)
const catchAsync = require(`${__dirname}/../../utils/catchAsync`)
const AppError = require(`${__dirname}/../../utils/appError`)
// TODO:
const extractTableData = (data) => {
  const { name, chairs, waiter, status, window_side } = data
  return { name, chairs, waiter, status, window_side }
}

module.exports = catchAsync(async (req, res, next) => {
  const tables = await Promise.all(
    req.body.tables.map((table) => {
      const data = extractTableData(table)
      data.restaurant = req.params.restaurantId
      return Table.create(data)
    }),
  )

  if (!tables) {
    return next(new AppError('Something went wrong', 400))
  }

  res.status(201).json({
    status: 'success',
    results: tables.length,
    data: {
      tables,
    },
  })
})
