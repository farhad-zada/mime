const Table = require(`${__dirname}/../../models/tableModel`)
const catchAsync = require(`${__dirname}/../../utils/catchAsync`)
const AppError = require(`${__dirname}/../../utils/appError`)
// TEST: this
// TODO: Reserve a Table

module.exports = catchAsync(async (req, res, next) => {
  const id = req.params.tableId
  const {
    starts_at,
    ends_at,
    number_ppl,
    additional_request,
  } = req.body

  const table = await Table.findById(id)
  if (!table) {
    return next(new AppError('Invalid table ID', 400))
  }

  table.reservation = {
    starts_at,
    ends_at,
    number_ppl,
    additional_request,
  }
  await table.save()

  res.status(200).json({
    status: 'success',
    data: { table },
  })
})
