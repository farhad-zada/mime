const catchAsync = require(`${__dirname}/../../utils/catchAsync`)

//TEST:

// Get a Single Table

module.exports = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      table: req.table,
    },
  })
})
