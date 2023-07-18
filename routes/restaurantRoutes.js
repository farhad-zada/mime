const express = require('express')
const restaurantController = require('../controllers/restaurantController')

const router = express.Router()

router
  .route('/')
  .get(restaurantController.getAllRestaurants)
  .post(restaurantController.createRestaurant)

router.route('/within').get( restaurantController.getRestaurantsWithin)

router
  .route('/:id')
  .get(restaurantController.getRestaurantById)
  .delete(restaurantController.deleteRestaurant)


module.exports = router
