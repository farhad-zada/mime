const sharp = require('sharp')

// TODO:  test  this
module.exports = async (req) => {
  try {
    const jpegBuffers = await Promise.all(
      req.media.jpegs.map((m) => {
        return sharp(m.buffer)
          .toFormat('jpeg')
          .jpeg()
          .toBuffer()
      }),
    )

    for (let i = 0; i < jpegBuffers.length; i++) {
      req.media.jpegs[i].buffer = jpegBuffers[i]
    }

    return req
  } catch (err) {
    console.log(err)
    return err
  }
}
