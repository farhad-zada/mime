const { Storage } = require('@google-cloud/storage')

const storage = new Storage({
  keyFilename: `${__dirname}/../../.dev/chatty-397711-ccd47cdf89ae.json`,
})

const bucket = storage.bucket('mime-mime')

module.exports = (destination) => {
  //
  const fileGS = bucket.file(destination) // file+GS -> [G]oogle [S]torage

  return fileGS.delete({ ignoreNotFound: true })
}
