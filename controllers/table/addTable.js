const Table = require(`${__dirname}/../models/tableModel`)
const catchAsync = require(`${__dirname}/../utils/catchAsync`)
const AppError = require(`${__dirname}/../utils/appError`)

const extractTableData = (req) => {
  const { name, chairs, waiter, status, window_side } =
    req.body
  return { name, chairs, waiter, status, window_side }
}

exports.addOne = catchAsync(async (req, res, next) => {
  const data = extractTableData(req)
  // console.log(data)
  data.restaurant = req.params.restaurantId
  // console.log('Writing to DB...')
  const table = await Table.create(data)
  // console.log('Writtent to DB!')

  if (!table) {
    return next(new AppError('Something went wrong', 400))
  }
  res.status(201).json({
    status: 'success',
    data: table,
  })
})
