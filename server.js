require('dotenv').config()
const mongoose = require('mongoose')
const { Storage } = require('@google-cloud/storage')
const rateLimit = require('express-rate-limit')
const sanitizer = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')

const app = require(`${__dirname}/app`)

//TODO: What to use express.static for?

const port = process.env.PORT

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
)

mongoose.connect(DB, { useNewUrlParser: true })

const storage = new Storage({
  keyFilename: `.dev/chatty-397711-ccd47cdf89ae.json`,
})

app.get('/test', (req, res) => {
  res.status(200).json({ status: 'success🔥' })
})
const server = app.listen(port, () => {
  console.log(`MiME running in port: ${port}`)
})
