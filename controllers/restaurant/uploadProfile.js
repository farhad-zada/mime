const sharp = require('sharp')
const catchAsync = require('../../utils/catchAsync')
const media = require('./../media/index')
const AppError = require('../../utils/appError')

//DONE

module.exports = catchAsync(async (req, res, next) => {
  const { buffer } = req.files.profile[0]

  req.urlToBeDeleted = req.restaurant.profileImage

  const jpegBuffer = await sharp(buffer)
    .toFormat('jpeg')
    .jpeg()
    .toBuffer()

  const destination = `restaurant/profiles/${
    req.params.restaurantId
  }-${Date.now()}.jpg`

  const { fileGS, promiseVoid } = media.uploadGS(
    jpegBuffer,
    destination,
    'image/jpeg',
  )

  await promiseVoid

  await fileGS.makePublic()

  const publicUrl = fileGS.publicUrl()

  req.restaurant.profileImage = publicUrl

  await req.restaurant.save({ validateBeforeSave: false })

  if (req.restaurant.profileImage !== publicUrl) {
    return next(
      new AppError(
        'Something went wrong! Please, try again!',
        400,
      ),
    )
  }

  next()
})
