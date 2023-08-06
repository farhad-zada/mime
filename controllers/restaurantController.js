const Restaurant = require('../models/restaurantModel')
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`)
const catchAsync = require(`${__dirname}/../utils/catchAsync`)
exports.getAllRestaurants = catchAsync(
  async (req, res, next) => {
    const features = new APIFeatures(
      Restaurant.find(),
      req.query,
    )
      .filter()
      .limitFields()
      .sort()
      .paginate()

    const restaurants = await features.query

    res.status(200).json({
      status: 'success',
      results: restaurants.length,
      data: { restaurants },
    })
  },
)

exports.getNear = catchAsync(async (req, res, next) => {
  const { lng, lat, dist } = req.query

  if (!lng | !lat | !dist) {
    return res.status(404).json({
      status: 'fail',
      message:
        'Please, enter longitude and latitude and the radius.',
    })
  }

  const features = new APIFeatures(
    Restaurant.find({
      location: {
        $near: {
          $maxDistance: dist * 1,
          $geometry: {
            type: 'Point',
            coordinates: [lng * 1, lat * 1],
          },
        },
      },
    }),
    req.query,
  )
    .filter('lng', 'lat', 'dist')
    .limitFields('owner')
    .sort()
    .paginate(100)

  const restaurants = await features.query

  /*

  If wanted it can be swithed:

  const restaurants = await Restaurant.find({
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
  */

  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    data: {
      restaurants,
    },
  })
})

exports.getRestaurantById = catchAsync(
  async (req, res, next) => {
    const id = req.params.id
    if (!id) {
      return next(new Error('No id included'))
    }

    const restaurants = await Restaurant.findById(id)

    res.status(200).json({
      status: 'success',
      results: restaurants.length,
      data: { restaurants },
    })
  },
)

exports.createRestaurant = catchAsync(
  async (req, res, next) => {
    let restaurant

    //TODO: Restrict the body items can be added
    restaurant = await Restaurant.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        restaurant,
      },
    })
  },
)
exports.deleteRestaurant = catchAsync(
  async (req, res, next) => {
    const restaurant = Restaurant.findByIdAndUpdate(
      req.params.id,
      {
        active: 'deleted',
      },
    )
    res.status(204).json({
      status: 'success',
      message: 'Restaurant successfully deleted.',
    })
  },
)
