const Restaurant = require('../models/restaurantModel')
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`)
const catchAsync = require(`${__dirname}/../utils/catchAsync`)

module.exports = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Restaurant.find({}),
    req.query,
  )
    .filter()
    .limitFields()
    .sort()
    .paginate(15)

  const restaurants = await features.query

  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    data: { restaurants },
  })
})
