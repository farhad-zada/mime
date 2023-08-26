const Restaurant = require('../models/restaurantModel')
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`)
const catchAsync = require(`${__dirname}/../utils/catchAsync`)

module.exports = catchAsync(async (req, res, next) => {
  const id = req.params.restaurantId
  if (!id) {
    return next(new Error('No id included'))
  }

  const restaurants = await Restaurant.findById(id)

  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    data: { restaurants },
  })
})
