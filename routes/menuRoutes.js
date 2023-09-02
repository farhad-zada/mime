const express = require('express')
const menuController = require(`${__dirname}/../controllers/menuController`)
const auth = require(`./../controllers/auth/index`)
const likesRoutes = require(`${__dirname}/../routes/likesRoutes`)

const router = express.Router({ mergeParams: true })

/*
1. Protection
1.1. Pretect who can modify a menu (restauran owner and menu TODO: admin)
1.2. Protect who can add to menu

2. Restriction
2.1. Restrict menu views 
2.2. Rstrict what can be added to menu

*/

router
  .route('/')
  .get(menuController.getMenu)
  .post(
    auth.authorisation.restaurantOwner,
    menuController.filterRequestData,
    menuController.addOne,
  )

router
  .route('/:itemId')
  .get(menuController.getOne)
  .patch(
    auth.authorisation.restaurantOwner,
    menuController.updateOne,
  )
  .delete(
    auth.authorisation.restaurantOwner,
    menuController.deleteOne,
  )

router.use('/:itemId/likes', likesRoutes)

module.exports = router
