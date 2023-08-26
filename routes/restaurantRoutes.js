const express = require('express')
const restaurantController = require('../controllers/restaurant/index')
const auth = require(`${__dirname}/../controllers/auth/index`)
const reviewRoutes = require(`${__dirname}/../routes/reviewRoutes`)
const likesRoutes = require(`${__dirname}/../routes/likesRoutes`)
const unfoldNestedDetails = require(`${__dirname}/../utils/unfoldNestedDetails`)
const menuRoutes = require(`${__dirname}/menuRoutes`)
const tableRoutes = require(`${__dirname}/tableRoutes`)

const router = express.Router()

router
  .route('/')
  .get(restaurantController.getMany)
  .post(restaurantController.createOne)

router.use(
  '/:restaurantId/reviews',
  unfoldNestedDetails,
  reviewRoutes,
)

router.use(
  '/:restaurantId/likes',
  unfoldNestedDetails,
  likesRoutes,
)

router.route('/near').get(restaurantController.getNears)

router
  .route('/:restaurantId')
  .get(restaurantController.getById)
  .delete(
    auth.restaurantOwner, //TODO: improve security for deletion
    restaurantController.deleteOne,
  )
router.use('/:restaurantId/tables', tableRoutes)

router.use('/:restaurantId/menu', menuRoutes)

module.exports = router
