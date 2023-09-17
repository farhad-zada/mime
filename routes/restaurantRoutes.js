const express = require('express')
const restaurantController = require('../controllers/restaurant/index')
const auth = require(`./../controllers/auth/index`)
const deletePreviousProfileImage = require('../utils/deletePreviousProfileImage')
const reviewRoutes = require(`${__dirname}/../routes/reviewRoutes`)
const likesRoutes = require(`${__dirname}/../routes/likesRoutes`)
const unfoldNestedDetails = require(`${__dirname}/../utils/unfoldNestedDetails`)
const menuRoutes = require(`${__dirname}/menuRoutes`)
const tableRoutes = require(`${__dirname}/tableRoutes`)

const router = express.Router()

router.route('/').get(restaurantController.getMany)

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
  .get(
    restaurantController.midFindById,
    restaurantController.getById,
  )
  .delete(
    auth.authorisation.restaurantOwner, //TODO: improve security for deletion
    restaurantController.deleteOne,
  )

// For belowe endpoints we check if the request sender is the restaurant owner
router.use('/:restaurantId/tables', tableRoutes)

router.use('/:restaurantId/menu', menuRoutes)

router.use(
  auth.authorisation.restaurantOwner, // here we add: !req.restaurant
)

router // NOT DONE yet
  .route('/:restaurantId/media')
  .post(restaurantController.uploadMedia)
  .delete()
router // Profile DONE
  .route('/:restaurantId/profile')
  .post(
    restaurantController.uploadProfile,
    deletePreviousProfileImage,
    restaurantController.returnUpdatedRestaurant,
  )
  .delete(restaurantController.deleteMedia)

module.exports = router
