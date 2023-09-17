const catchAsync = require('../../utils/catchAsync')
const media = require('./../media/index')
const AppError = require('../../utils/appError')

// DONE

module.exports = catchAsync(async (req, res, next) => {
  //
  const { toBeDeletedMedia } = req.body // put this in the request body
  //

  req.restaurant.updateOne({
    $pull: { images: { url: { $in: toBeDeletedMedia } } },
  })

  const deleteDestinations = toBeDeletedMedia
    .map((url) => {
      const result = url.match(/mime-mime(.*)$/)
      if (result[1]) return decodeURIComponent(result[1])
    })
    .filter(Boolean)

  const results = profileImage.match(/mime-mime(.*)$/)

  const deletePromises = deleteDestinations.map(
    (destination) => {
      return media.deleteGS(destination)
    },
  )

  await Promise.all([
    ...deletePromises,
    req.restaurant.save({ validateBeforeSave: false }),
  ])

  res.status(200).json({
    status: 'success',
    data: {
      restaurant: req.restaurant,
    },
  })
})
