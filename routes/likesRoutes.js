const likesController = require(`./../controllers/like/index`)

const express = require('express')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(likesController.getLikes)
  .post(likesController.like)
  .delete(likesController.unlike)

module.exports = router
