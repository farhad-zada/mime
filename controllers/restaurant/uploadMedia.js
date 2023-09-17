const catchAsync = require('../../utils/catchAsync')
const mediaController = require('../media/index')

//TODO: test this

// TODO: add tags here
module.exports = catchAsync(async (req, res, next) => {
  //
  const filesGS = []
  const promises = []

  req.media.videos.forEach((video) => {
    const { fileGS, promiseVoid } =
      mediaController.uploadGS(
        video.buffer,
        video.destination,
        video.contentType,
      )
    filesGS.push(fileGS)
    promises.push(promiseVoid)
  })

  req.media.jpegs.forEach((jpeg) => {
    const { fileGS, promiseVoid } =
      mediaController.uploadGS(
        jpeg.buffer,
        jpeg.destination,
        jpeg.contentType,
      )
    filesGS.push(fileGS)
    promises.push(promiseVoid)
  })

  await Promise.all(promises)

  await Promise.all(
    filesGS.map((fileGS) => fileGS.makePublic()),
  ) // Here we wait all the files uploaded to be made public

  const publicUrls = filesGS.map(
    (fileGS) => fileGS.publicUrl(), // Here we get the public URL of each file
  )

  req.publicUrls = publicUrls
  publicUrls.forEach((url) => {
    req.restaurant.images.push({ url })
  })

  await req.restaurant.save({ validateBeforeSave: true })

  res.status(200).json({
    status: 'success',
    data: {
      restaurant: req.restaurant,
      public_urls: publicUrls,
    },
  })
})
