const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')
const mediaController = require('../media/index')

/**
 * Using this middleware we are gonna upload all the media: images and videos
 */

module.exports = catchAsync(async (req, res, next) => {
  const files = req.files.media
  const filesGS = []

  req.media.videos = []
  req.media.jpegs = []

  files.map((file) => {
    // Here we set the destionaion for the file, and we save videos not in the same place with images
    const { mimetype, buffer } = file

    if (mimetype.startsWith('video')) {
      const destination = `restaurants/media/videos/${
        req.params.restaurantId
      }-${Date.now()}.${mimetype.split('/')[1]}`
      req.media.videos.push({
        destination,
        contentType: mimetype,
        buffer,
      })
    } else if (mimetype.startsWith('image')) {
      // DO this
      const destination = `restaurants/media/images/${
        req.params.restaurantId
      }-${Date.now()}.jpg`

      req.media.jpegs.push({
        destination,
        contentType: mimetype,
        buffer,
      })
    } else {
      return next(
        new AppError(`Unkown file type: ${mimetype}`, 400),
      )
    }
  })

  next()
})
// await Promise.all(
//   // We use Promise.all([...]) so that we do not wait each single file to upload to continue,
//   // we do all we can without interrupting the procedure and only then we wait all the promises to be fullfilled
//   //

//   files.map(async (file) => {
//     // Here we set the destionaion for the file, and we save videos not in the same place with images
//     const destination = `restaurant/media/${
//       file.mimetype.split('/')[0]
//     }s/restaurant-${
//       req.params.restaurantId
//     }-${Date.now()}.${file.mimetype.split('/')[1]}`
//     const { fileGS, promiseVoid } =
//       await mediaController.uploadGS(
//         file.buffer,
//         destination,
//         file.mimetype,
//       )

//     filesGS.push(fileGS) // Since fileGS is not a promise, we do not need to wait for it, so we do not add it into waitlist

//     return promiseVoid // Here we return this void so we wait for files to be all uploaded to Google Storage
//   }),
// )

// await Promise.all(
//   filesGS.map((fileGS) => fileGS.makePublic()),
// ) // Here we wait all the files uploaded to be made public

// const publicUrls = filesGS.map(
//   (fileGS) => fileGS.publicUrl(), // Here we get the public URL of each file
// )

// req.publicUrls = publicUrls

// res.status(200).json({
//   status: 'success',
//   data: {
//     public_urls: publicUrls,
//   },
// })
