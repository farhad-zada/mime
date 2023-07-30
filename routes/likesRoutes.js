const likesController = require(`${__dirname}/../controllers/likeController`)
const express = require('express')

const router = express.Router({ mergeParams: true })

router.route('/like').post(likesController.like).delete(likesController.unlike)

router
  .route('/dislike')
  .post(likesController.dislike)
  .delete(likesController.undislike)

module.exports = router
