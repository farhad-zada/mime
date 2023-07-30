const likesController = require(`${__dirname}/../controllers/likeController`)
const express = require('express')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(likesController.getLikes)
  .post(likesController.like)
  .delete(likesController.unlike)

module.exports = router
