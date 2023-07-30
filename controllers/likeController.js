const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

const Like = require(`${__dirname}/../models/likeModel`)

//TODO: get all likes of current restaurnt {or menu item}

exports.getLikes = catchAsync(async (req, res, next) => {
  const { status } = req.query
  if (!status || !['like', 'dislike'].includes(status)) {
    return next(
      new AppError(`Invalid status: ${status}!`, 400),
    )
  }
  const likes = await Like.find({
    to: req.nestedDetails.to,
    status,
  }).sort({ ts: -1 })
  res.status(200).json({
    status: 'success',
    data: { results: likes.length, likes },
  })
})

exports.like = catchAsync(async (req, res, next) => {
  const { from, to, modelName } = req.nestedDetails
  const { status } = req.body
  if (!status || !['like', 'dislike'].includes(status)) {
    return next(
      new AppError(`Invalid status: ${status}!`, 400),
    )
  }

  let like
  like = await Like.findOne({ from, to })
  if (like) {
    like.status = status
    await like.save()
  } else if (!like) {
    like = await Like.create({
      from,
      to,
      status,
      modelName,
    })
  }
  res.status(200).json({
    status: 'success',
    data: {
      like,
      message: `You liked ${to} successfully!`,
    },
  })
})

exports.unlike = catchAsync(async (req, res, next) => {
  const { from, to } = req.nestedDetails

  const statuses = {
    like: 'unlike',
    dislike: 'undislike',
  }

  let like
  like = await Like.findOne({ from, to })

  if (!like) {
    return next(new AppError('Invalid request!', 400))
  }
  like.status = statuses[like.status]

  await like.save()
  res.status(204).json({
    status: 'success',
    data: { message: `You unliked ${to} successfully!` },
  })
})
