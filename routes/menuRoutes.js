const express = require('express')
const menuController = require(`${__dirname}/../controllers/menuController`)
const likesRoutes = require(`${__dirname}/../routes/likesRoutes`)

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(menuController.getMenu)
  .post(
    menuController.filterRequestData,
    menuController.addOne,
  )

router
  .route('/:itemId')
  .get(menuController.getOne)
  .patch(menuController.updateOne)
  .delete(menuController.deleteOne) //TODO: Add restaurant owner checker to auth

router.use('/:itemId/likes', likesRoutes)

module.exports = router
