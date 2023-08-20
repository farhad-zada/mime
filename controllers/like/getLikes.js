const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')
const Like = require('../../models/likeModel')

module.exports = catchAsync(async (req, res, next) => {
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
