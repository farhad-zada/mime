const express = require('express')
const tableController = require('../controllers/tableController')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(tableController.getAll)
  .post(tableController.addOne)

router
  .route('/:tableId')
  .get(tableController.getOne)
  .patch(tableController.updateOne)
  .delete(tableController.deleteOne)

module.exports = router
