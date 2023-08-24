const Table = require(`${__dirname}/../../models/tableModel`)
const catchAsync = require(`${__dirname}/../../utils/catchAsync`)
const AppError = require(`${__dirname}/../../utils/appError`)

// Update an existing Table
//TEST: this
module.exports = catchAsync(async (req, res, next) => {
  data = extractTableData(req)
  const { restaurantId, tableId } = req.params
  if (!restaurantId || !tableId) {
    return next(
      new AppError(
        'Table and restaurant IDs are required!',
        400,
      ),
    )
  }

  const table = await Table.findById(tableId)

  if (!table) {
    return next(new AppError('Invalid table ID', 403))
  }

  Object.keys(data).forEach((key) => {
    table[key] = data[key]
  })

  await table.save()

  res.status(200).json({
    status: 'success',
    data: {
      table,
    },
  })
})
