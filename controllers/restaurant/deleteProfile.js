const catchAsync = require('../../utils/catchAsync')
const media = require('./../media/index')
const AppError = require('../../utils/appError')

// DONE

module.exports = catchAsync(async (req, res, next) => {
  //
  const profileImage = req.restaurant.profileImage
  if (!profileImage) {
    return next(new AppError('Profile is empty!', 400))
  }
  //
  const results = profileImage.match(/restaurant.*/)

  const decodedPathName = decodeURIComponent(results[0])
  req.restaurant.profileImage = undefined

  await Promise.all([
    media.deleteGS(decodedPathName),
    req.restaurant.save({ validateBeforeSave: false }),
  ])

  // Set default restaurant profile pic or you can set in the frontend

  res.status(200).json({
    status: 'success',
    data: {
      restaurant: req.restaurant,
    },
  })
})
