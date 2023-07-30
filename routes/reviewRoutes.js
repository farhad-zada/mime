const express = require('express')
const reviewController = require(`${__dirname}/../controllers/reviewController`)

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.addReview)

router
  .route('/:id')
  .get(reviewController.getReviewById)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview)

module.exports = router
