const AppError = require('../utils/appError')

const Review = require(`${__dirname}/../models/reviewModel`)
const catchAsync = require(`${__dirname}/../utils/catchAsync`)

/// 1. Add review

exports.addReview = catchAsync(async (req, res, next) => {
  const { text, rating } = req.body

  const { from, to, modelName } = req.nestedDetails

  const review = await Review.create({
    from,
    to,
    text,
    modelName,
    rating,
  })

  if (!review) {
    return next(new AppError('Something went wrong!', 400))
  }
  res
    .status(201)
    .json({ status: 'success', data: { review } })
})
/// 2. Get all reviews of a certain restaurant or menu item

exports.getAllReviews = catchAsync(
  async (req, res, next) => {
    const { to, modelName } = req.nestedDetails
    const reviews = await Review.find({ to, modelName })

    if (!reviews) {
      return next(
        new AppError('Something went wrong!', 400),
      )
    }

    res
      .status(200)
      .json({ status: 'success', data: { reviews } })
  },
)
/// 3. Get a single review of a restaurant or menu item

exports.getReviewById = catchAsync(
  async (req, res, next) => {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(200).json({
        status: 'success',
        data: {
          review,
          message: 'No review with certain ID.',
        },
      })
    }
    res
      .status(200)
      .json({ status: 'success', data: { review } })
  },
)
/// 4. Update review of a restaurant or menu item (you must be its owner)

exports.updateReview = catchAsync(
  async (req, res, next) => {
    const id = req.params.id

    // If a review is not by the request ender then they can not modify it
    const review = await Review.findOne({
      _id: id,
      from: req.user.id,
    })

    if (!review) {
      return next(
        new AppError('You cannot modify this review!', 403),
      )
    }

    review.text = req.body.text
    review.rating = req.body.rating
      ? req.body.rating
      : review.rating

    await review.save()

    res
      .status(200)
      .json({ status: 'success', data: { review } })
  },
)

// 5. Delete a review ( you can delte reviews only made by you )

exports.deleteReview = catchAsync(
  async (req, res, next) => {
    await Review.deleteOne({
      from: req.user.id,
      _id: req.params.id,
    })
    res.status(204).json({
      status: 'success',
      message: 'Review deleted successfully!',
    })
  },
)
