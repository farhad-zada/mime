const Table = require(`${__dirname}/../../models/tableModel`)
const catchAsync = require(`${__dirname}/../../utils/catchAsync`)

//TEST:

// Get tables all of the restaurant

module.exports = catchAsync(async (req, res, next) => {
  const restaurant = req.params.restaurantId

  const tables = await Table.find({ restaurant })

  res.status(200).json({
    status: 'success',
    results: tables.length,
    data: {
      tables,
    },
  })
})
