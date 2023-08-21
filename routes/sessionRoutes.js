const router = require('express').Router({
  mergeParams: true,
})
const sessionController = require('../controllers/session/index')

router.route('/').post(sessionController.enterSession)

module.exports = router
