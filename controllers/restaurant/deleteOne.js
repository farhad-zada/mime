const Restaurant = require('../../models/restaurantModel')
const APIFeatures = require(`${__dirname}/../../utils/apiFeatures`)
const catchAsync = require(`${__dirname}/../../utils/catchAsync`)

//TODO: improve security for deletion
module.exports = catchAsync(async (req, res, next) => {
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
})
