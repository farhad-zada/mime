const express = require('express')
const tableController = require('../controllers/table/index')
const sessionRoutes = require('../routes/sessionRoutes')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(tableController.getTables)
  .post(tableController.addTable)

router
  .route('/:tableId')
  .get(tableController.getOneTable)
  .patch(tableController.updateTable)
  .delete(tableController.deleteTable)

router.use('/:tableId/session', sessionRoutes)
module.exports = router
