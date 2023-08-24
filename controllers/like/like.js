const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')
const Like = require('../../models/likeModel')

module.exports = catchAsync(async (req, res, next) => {
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
