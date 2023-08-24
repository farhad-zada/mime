const express = require('express')
const auth = require(`${__dirname}/../controllers/auth/index`)
const user = require(`${__dirname}/../controllers/userController`)

const router = express.Router()

router.route('/signup').post(auth.signup)
router.route('/verifyEmail/:token').get(auth.verifyEmail)
router.route('/login').get(auth.login)
router.route('/logout').get(auth.logout)
router.route('/forgotPassword').get(auth.forgotPassword)
router
  .route('/resetPassword/:token')
  .post(auth.resetPassword)
router.route('/updatePassword').post(auth.updatePassword)
router.route('/deleteUser/:email').delete(user.deleteUser)

module.exports = router
