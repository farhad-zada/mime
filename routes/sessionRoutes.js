const router = require('express').Router({
  mergeParams: true,
})
const sessionController = require('../controllers/session/index')
const sessionChecks = require('../controllers/session/checks/index')

router.route('/').post(
  sessionChecks.userStatus, //Here we check if the user is not on another session already
  sessionController.enterSession, //Here enter the table and the msg.sender into the session
  // If the table is on session then a request is sent to the session admin. If they accept
  // then current request sender user is entered into the session
)
router
  .route('/:sessionId/:sessionRequestId')
  .post(
    sessionChecks.userStatus,
    sessionController.midFindSessionById,
    sessionController.midFindSessionRequestById,
    sessionController.acceptSessionRequest,
  )
module.exports = router
