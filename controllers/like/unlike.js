const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')
const Like = require('../../models/likeModel')

module.exports = catchAsync(async (req, res, next) => {
  const { from, to } = req.nestedDetails

  const statuses = {
    like: 'unlike',
    dislike: 'undislike',
  }

  const like = await Like.findOne({ from, to })

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
