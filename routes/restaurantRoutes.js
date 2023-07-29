const express = require('express')
const restaurantController = require('../controllers/restaurantController')
const auth = require(`${__dirname}/../controllers/authController`)

const router = express.Router()

router.use(auth.authed)

// router.use(auth.restrict('admin-mime', 'user'))

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
