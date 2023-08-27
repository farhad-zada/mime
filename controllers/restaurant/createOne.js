const Restaurant = require('../../models/restaurantModel')
const APIFeatures = require(`${__dirname}/../../utils/apiFeatures`)
const catchAsync = require(`${__dirname}/../../utils/catchAsync`)

module.exports = catchAsync(async (req, res, next) => {
  let restaurant

  //TODO: Restrict the body items can be added
  /**
   * Bear in mind that restaurants are not validated as they created
   * They can be validated only by `validator-restaurant-mime`s.
   * `validator-restaurant-mime` role is assigned by MiME organization
   * Since restaurants are not validated they should not been visiblae withought validation
   *
   */
  restaurant = await Restaurant.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      restaurant,
    },
  })
})
