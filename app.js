const express = require("express")
const morgan = require("morgan") // Not used
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const sanitizer = require("express-mongo-sanitize")
const xss = require("xss-clean")

const restaurantRoutes = require("./routes/restaurantRoutes")

const app = express()

app.use(express.json())

app.use(helmet())

app.use(sanitizer())

app.use(xss())

const limiter = rateLimit({
  max: 23,
  windowMs: 10 * 60 * 1000,
})

app.use("/", limiter)

app.use("/app/v1/restaurants", restaurantRoutes)

module.exports = app
