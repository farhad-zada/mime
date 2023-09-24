const express = require('express')
const menuController = require('./../controllers/menuController')
const auth = require(`./../controllers/auth/index`)
const likesRoutes = require(`${__dirname}/../routes/likesRoutes`)
const media = require('../controllers/media/index')
const router = express.Router({ mergeParams: true })
const reviewRoutes = require(`./../routes/reviewRoutes`)

/*
1. Protection
1.1. Pretect who can modify a menu (restauran owner and menu TODO: admin)
1.2. Protect who can add to menu

2. Restriction
2.1. Restrict menu views 
2.2. Rstrict what can be added to menu

*/

// router.route('/').get(menuController.getMenu).post(
//   auth.authorisation.restaurantOwner,
//   menuController.filterRequestData,
//   menuController.addOne,
//   //TODO: addMany
// )

/**
 * addItems
 * updateItems
 * implementDiscount
 *
 * implement Discoun by Section
 */

router
  .route('/')
  .post(
    auth.authorisation.restaurantOwner,
    media.multerFile, // Here we multer after we check that it is the owner of the restaurant so if they are not they will not be able to send malicious data
    menuController.parseItems, // We parse items and also set indexes of each image into req.body.images Object
    menuController.checkItemsImages, // Here we check if all the files are image and set them into req.media.jpegs to be processed
    menuController.uploadItemsImages, // Here we upload images to GS and get public URLs and also add them into menu items, e.g. req.body.items[i].image = publicURL
    menuController.addMany, // Here we finally add all the items into DB
  )
  .patch(
    auth.authorisation.restaurantOwner,
    media.multerFile,
    menuController.parseItems,
    menuController.checkItemsImages,
    menuController.uploadItemsImages,
  )
  .delete(
    auth.authorisation.restaurantOwner,
    menuController.deleteMany,
  )

router
  .route('/:itemId')
  .get(menuController.getOne)
  .delete(
    auth.authorisation.restaurantOwner,
    menuController.deleteOne,
  )

router.use('/:itemId/likes', likesRoutes)
router.use('/:itemId/reviews', reviewRoutes)

module.exports = router

// TODO: delete

// const req = [
//   {
//     name: 'CocaCola',
//     price: '2.99',
//     image: 'here will be the file',
//   },
//   {
//     name: 'CocaCola',
//     price: '2.99',
//     image: 'here will be the file',
//   },
//   {
//     name: 'CocaCola',
//     price: '2.99',
//     image: 'here will be the file',
//   },
// ]
