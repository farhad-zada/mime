const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

const Like = require(`${__dirname}/../models/likeModel`)

exports.like = catchAsync(async (req, res, next) => {
  const { by, to, modelName } = req.nestedDetails

  let like
  like = await Like.findOne({ by, to })
  if (like) {
    like.status = 'like'
    await like.save()
  } else if (!like) {
    like = await Like.create({ by, to, like: 'like', modelName })
  }
  res.status(200).json({
    status: 'success',
    data: { like, message: `You liked ${to} successfully!` },
  })
})

exports.unlike = catchAsync(async (req, res, next) => {
  const { by, to } = req.nestedDetails
  let like
  like = await Like.findOne({ by, to })

  if (!like) {
    return next(new AppError('Invalid request!', 400))
  }
  like.status = 'unlike'
  await like.save()
  res.status(204).json({
    status: 'success',
    data: { message: `You unliked ${to} successfully!` },
  })
})

exports.dislike = catchAsync(async (req, res, next) => {
  const { by, to, modelName } = req.nestedDetails

  let like
  like = await Like.findOne({ by, to })
  if (like) {
    like.status = 'dislike'
    await like.save()
  } else if (!like) {
    like = await Like.create({ by, to, like: 'dislike', modelName })
  }
  res.status(200).json({
    status: 'success',
    data: { like, message: `You liked ${to} successfully!` },
  })
})

exports.undislike = catchAsync(async (req, res, next) => {
  const { by, to } = req.nestedDetails
  let like
  like = await Like.findOne({ by, to })

  if (!like) {
    return next(new AppError('Invalid request!', 400))
  }
  like.status = 'undislike'
  await like.save()
  res.status(204).json({
    status: 'success',
    data: { message: `You unliked ${to} successfully!` },
  })
})
