const express = require('express')
const restaurantController = require('../controllers/restaurantController')
const auth = require(`${__dirname}/../controllers/authController`)
const reviewRoutes = require(`${__dirname}/../routes/reviewRoutes`)
const likesRoutes = require(`${__dirname}/../routes/likesRoutes`)
const unfoldNestedDetails = require(`${__dirname}/../utils/unfoldNestedDetails`)

const router = express.Router()

router.use(auth.authed)

// router.use(auth.restrict('admin-mime', 'user'))

// ALL review APIs are authed -> line: 9
router.use('/:restaurantId/reviews', reviewRoutes)
router.use('/:restaurantId/likes', unfoldNestedDetails, likesRoutes)

// router.use('/:restaurantId/menu', menuRoutes)

router
  .route('/')
  .get(restaurantController.getAllRestaurants)
  .post(restaurantController.createRestaurant)

router.route('/within').get(restaurantController.getRestaurantsWithin)

router.route('/near').get(restaurantController.getNear)

router
  .route('/:id')
  .get(restaurantController.getRestaurantById)
  .delete(restaurantController.deleteRestaurant)

module.exports = router
