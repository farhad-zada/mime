const User = require(`${__dirname}/../models/userModel`)
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const mediaController = require('./media/index')
const sharp = require('sharp')

//TODO: test the profile is updated
//TODO: test the error result from media controller

// DONE
exports.uploadProfile = catchAsync(
  async (req, res, next) => {
    //
    req.urlToBeDeleted = req.user.photo

    const { buffer, mimetype } = req.files.profile[0]

    const destination = `users/MiME-${
      req.user.id
    }-${Date.now()}.jpg`

    // TODO: resize
    const jpegBuffer = await sharp(buffer).jpeg().toBuffer()

    const contentType = mimetype

    const { fileGS, promiseVoid } =
      mediaController.uploadGS(
        jpegBuffer,
        destination,
        contentType,
      )

    await promiseVoid

    await fileGS.makePublic()

    const publicUrl = fileGS.publicUrl()

    if (!publicUrl) {
      return next(
        new AppError(
          'Something went wrong. Try again.',
          400,
        ),
      )
    }

    req.user.photo = publicUrl

    await req.user.save({ validateBeforeSave: false })

    next()
  },
)

// DONE
exports.deleteProfile = catchAsync(
  async (req, res, next) => {
    req.urlToBeDeleted = req.user.photo

    req.user.photo = undefined

    await req.user.save({ validateBeforeSave: false })
    next()
  },
)
exports.returnUpdatedUser = catchAsync(
  async (req, res, next) => {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    })
  },
)
