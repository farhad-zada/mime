const router = require('express').Router()
const rolesController = require('../controllers/auth/authorisation/rolesController')

router
  .route('/:userId')
  .get(rolesController.userRoles)
  .patch(rolesController.addRole)

module.exports = router
