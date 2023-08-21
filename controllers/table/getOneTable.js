const Table = require(`${__dirname}/../../models/tableModel`)
const catchAsync = require(`${__dirname}/../../utils/catchAsync`)

//TEST:

// Get a Single Table

module.exports = catchAsync(async (req, res, next) => {
  const id = req.params.tableId
  const table = Table.findById(id)

  res.status(200).json({
    status: 'success',
    data: {
      table,
    },
  })
})
