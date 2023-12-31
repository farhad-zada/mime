const express = require('express')
const morgan = require('morgan') // Not used
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const sanitizer = require('express-mongo-sanitize')
//TODO:
const xss = require('xss-clean')
const cookieParser = require('cookie-parser')

const restaurantRoutes = require('./routes/restaurantRoutes')
const reviewRoutes = require(`${__dirname}/routes/reviewRoutes`)
const userRoutes = require(`${__dirname}/routes/userRoutes`)
const auth = require(`./controllers/auth/index`)
const sessionRoutes = require(`${__dirname}/routes/sessionRoutes`)
const globalErrorHandler = require(`${__dirname}/controllers/errorController`)
const AppError = require(`${__dirname}/utils/appError`)

const app = express()

app.use(express.json())

app.use(helmet())

app.use(sanitizer())

app.use(xss())

const limiter = rateLimit({
  max: 23,
  windowMs: 10 * 60 * 1000,
})

app.use('/', limiter)
app.use(cookieParser())

app.use('/app/v1/session/', sessionRoutes)

app.use('/app/v1/user/', userRoutes)

app.use(auth.authentication.authed)

app.use('/app/v1/restaurants', restaurantRoutes)
app.use(
  '/app/v1/reviews',
  auth.authorisation.restrict('admin-mime'),
  reviewRoutes,
)

app.all('*', (req, res, next) => {
  console.log(req.originalUrl, Date.now())

  return next(
    new AppError(
      `Can't find ${req.protocol}://${req.get('host')}${
        req.originalUrl
      } on this server!`,
      404,
    ),
  )
})

app.use(globalErrorHandler)
module.exports = app
