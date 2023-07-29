const Review = require(`${__dirname}/../models/reviewModel`)

/// 1. Add review

exports.addReview = async (req, res, next) => {
  const review = await Review.create(req.body)

  if (!review) {
    res.status(404).json({ status: 'fail', message: 'Something went wrong!' })
  }
  res.status(201).json({ status: 'success', data: { review } })
}

/// 2. Get all reviews

exports.getAllReviews = async (req, res, next) => {
  const reviews = await Review.find()

  if (!reviews) {
    res.status(404).json({ status: 'fail', message: 'Something went wrong!' })
  }

  res.status(200).json({ status: 'success', data: { reviews } })
}

/// 3. Get a single review

exports.getReviewById = async (req, res, next) => {
  const _id = req.id

  const review = await Review.find({ _id })

  if (!review) {
    res.status(404).json({ status: 'fail', message: 'Something went wrong!' })
  }
  res.status(200).json({ status: 'success', data: { review } })
}

/// 4. Update review

exports.updateReview = async (req, res, next) => {
  const id = req.id

  const review = await Review.findByIdAndUpdate(id, {
    text: req.text,
    rating: req.rating,
  })

  if (!review) {
    res.status(404).json({ status: 'fail', message: 'Something went wrong!' })
  }
  res.status(200).json({ status: 'success', data: { review } })
}

/// 5. Delete a review

// exports.getAllReviews = async (req, res, next) => {
//   const _id = req.id

//   await Review.delete({ _id })

//   res.status(200).json({ status: 'success' })
// }
