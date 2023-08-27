const Restaurant = require('../../models/restaurantModel')
const APIFeatures = require(`${__dirname}/../../utils/apiFeatures`)
const catchAsync = require(`${__dirname}/../../utils/catchAsync`)

//TEST: this
module.exports = catchAsync(async (req, res, next) => {
  const { lng, lat, dist } = req.query

  if (!lng | !lat | !dist) {
    return res.status(404).json({
      status: 'fail',
      message:
        'Please, enter longitude and latitude and the radius.',
    })
  }

  const _query = Restaurant.find({
    location: {
      $near: {
        $maxDistance: dist * 1,
        $geometry: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
      },
    },
  })

  const query = new APIFeatures(_query, req.query)
    .filter('lng', 'lat', 'dist')
    .limitFields('owner')
    .sort()
    .paginate(100)

  const restaurants = await query.query

  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    data: {
      restaurants,
    },
  })
})
