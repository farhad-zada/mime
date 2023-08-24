const Table = require(`${__dirname}/../../models/tableModel`)
const catchAsync = require(`${__dirname}/../../utils/catchAsync`)

//TEST: this

module.exports = catchAsync(async (req, res, next) => {
  Table.findByIdAndDelete(req.params.tableId)

  res.status(204).json({
    status: 'success',
    message: 'Table deleted successfully!',
  })
})
