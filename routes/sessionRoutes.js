const router = require('express').Router({
  mergeParams: true,
})
const sessionController = require('../controllers/session/index')
router.route('/').post(sessionController.createSession)
module.exports = router
