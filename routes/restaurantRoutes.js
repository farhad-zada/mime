const express = require('express')
const restaurantController = require('../controllers/restaurantController')
const auth = require(`${__dirname}/../controllers/authController`)
const reviewRoutes = require(`${__dirname}/../routes/reviewRoutes`)
const likesRoutes = require(`${__dirname}/../routes/likesRoutes`)
const unfoldNestedDetails = require(`${__dirname}/../utils/unfoldNestedDetails`)
const menuRoutes = require(`${__dirname}/menuRoutes`)

const router = express.Router()

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

router.use('/:restaurantId/menu', menuRoutes)

router
  .route('/')
  .get(restaurantController.getAllRestaurants)
  .post(restaurantController.createRestaurant)

router.route('/near').get(restaurantController.getNear)

router
  .route('/:id')
  .get(restaurantController.getRestaurantById)
  .delete(
    auth.restaurantOwner,
    restaurantController.deleteRestaurant,
  )

module.exports = router
