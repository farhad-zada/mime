const Table = require(`${__dirname}/../../models/tableModel`)
const catchAsync = require(`${__dirname}/../../utils/catchAsync`)
const APIFeatures = require(`../../utils/apiFeatures`)

//TEST:

// Get tables all of the restaurant

module.exports = catchAsync(async (req, res, next) => {
  req.query.restaurant = req.params.restaurantId

  const query = new APIFeatures(Table.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate(15)

  const tables = await query.query

  res.status(200).json({
    status: 'success',
    results: tables.length,
    data: {
      tables,
    },
  })
})
