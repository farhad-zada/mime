const express = require('express')
const auth = require(`${__dirname}/../controllers/authController`)

const router = express.Router()

router.route('/signup').post(auth.signup)
router.route('/login').get(auth.login)
router.route('/logout').get(auth.logout)
router.route('/forgotPassword').get(auth.forgotPassword)
router
  .route('/resetPassword/:token')
  .post(auth.resetPassword)
router.route('/updatePassword').post(auth.updatePassword)

module.exports = router
