const RestaurantCreation = require('../../models/creatorRestaurantActivity')
const Restaurant = require('../../models/restaurantModel')
const APIFeatures = require(`${__dirname}/../../utils/apiFeatures`)
const catchAsync = require(`${__dirname}/../../utils/catchAsync`)

module.exports = catchAsync(async (req, res, next) => {
  const { name, email } = req.body
  const owner = await User.findOne({ email })
  if (!owner) {
    return next(
      new AppError('No user found with the email.', 400),
    )
  }
  //TODO: Restrict the body items can be added

  /**
   * Restaurants are created by restaurant creators mime,
   * and they are validated by owners.
   * They get a activity status of `not-validated` till the owner validates them
   * hashed validation key is used to validate created restaurants
   */
  const restaurant = await Restaurant.create({
    name,
    owner,
  })

  if (!restaurant) {
    return next(
      new AppError(
        'Something went wrong with restaurant creation!',
        400,
      ),
    )
  }

  const validation = RestaurantCreation.create({
    validator: req.user.id,
    restaurant: restaurant.id,
  })

  if (!validation) {
    await restaurant.delete()
    return next(
      new AppError(
        'Something went wrong with validation!',
        400,
      ),
    )
  }

  //TODO: send mail to owner to validate the restaurant
  //TODO: and when the owner validates the ownership add the id into restaurants section of the owner

  res.status(201).json({
    status: 'success',
    data: {
      restaurant,
      validation,
    },
  })
})
