const express = require('express')
const reviewController = require(`${__dirname}/../controllers/reviewsController`)

const router = express.Router()

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.addReview)

module.exports = router
