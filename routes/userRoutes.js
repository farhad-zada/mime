const express = require('express')
const auth = require(`../controllers/auth/index`)
const user = require(`../controllers/userController`)

const router = express.Router()

router.route('/signup').post(auth.authentication.signup)
router
  .route('/verifyEmail/:token')
  .get(auth.authentication.verifyEmail)
router.route('/login').get(auth.authentication.login)
router.route('/logout').get(auth.authentication.logout)
router
  .route('/forgotPassword')
  .get(auth.authentication.forgotPassword)
router
  .route('/resetPassword/:token')

  .post(auth.authentication.resetPassword)
router
  .route('/updatePassword')
  .post(auth.authentication.updatePassword)
//TODO: delete this
// router.route('/deleteUser/:email').get(user.deleteUser)

module.exports = router
