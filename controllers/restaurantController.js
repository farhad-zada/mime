const Restaurant = require('../models/restaurantModel')

exports.getAllRestaurants = async (req, res, next) => {
  const limit = req.query.limit * 1 || 5
  const restaurants = await Restaurant.find()
    .limit(limit)
    .select('name location profileImage')

  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    data: { restaurants },
  })
}

exports.getRestaurantsWithin = async (req, res, next) => {
  const { lng, lat, dist } = req.query

  if (!lng | !lat | !dist) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please, enter longitude and latitude and the radius.',
    })
  }

  const restaurants = await Restaurant.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
        distanceField: 'dist.distance', // required
        distanceMultiplier: 1,
        maxDistance: dist * 1,
        includeLocs: 'dist.location',
        // query: {slug: {$gt: 's'}},
        spherical: true,
      },
    },
    { $project: { name: 1, dist: 1 } },
  ])

  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    data: {
      restaurants,
    },
  })
}

exports.getNear = async (req, res, next) => {
  const { lng, lat, dist } = req.query

  if (!lng | !lat | !dist) {
    return res.status(404).json({
      status: 'fail',
      message: 'Please, enter longitude and latitude and the radius.',
    })
  }

  // let restaurants = await Restaurant.find({});

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
    .lean()
    .exec()

  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    data: {
      restaurants,
    },
  })
}

exports.getRestaurantById = async (req, res, next) => {
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
}

exports.createRestaurant = async (req, res, next) => {
  let restaurant
  try {
    //TODO: Restrict the body items can be added
    restaurant = await Restaurant.create(req.body)
  } catch (e) {
    return res.status(400).json({ status: 'fail', message: e })
  }
  res.status(201).json({
    status: 'success',
    data: {
      restaurant,
    },
  })
}

exports.deleteRestaurant = async (req, res, next) => {
  const restaurant = Restaurant.findByIdAndUpdate(req.params.id, {
    active: 'deleted',
  })
  res
    .status(204)
    .json({ status: 'success', message: 'Restaurant successfully deleted.' })
}

exports.getRecommended = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'This route not been implemented yet!',
  })
}
