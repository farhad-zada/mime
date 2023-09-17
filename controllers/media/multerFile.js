const multer = require('multer')
const AppError = require('../../utils/appError')

const storage = multer.memoryStorage()

const filter = (req, file, callback) => {
  if (
    ['image', 'video'].includes(file.mimetype.split('/')[0])
  ) {
    callback(null, true)
  } else {
    callback(
      new AppError(
        'Only image and video files can be uploaded!',
        400,
      ),
      false,
    )
  }
}

const multerFile = multer({
  storage: storage,
  fileFilter: filter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
})

module.exports = multerFile.fields([
  { name: 'profile', maxCount: 1 }, // We can add multiple images for profile
  { name: 'menu', maxCount: 20 },
  { name: 'media', maxCount: 10 },
  // { name: 'interiors', maxCount: 10 }, // Can be increased later
  { name: 'tables', maxCount: 10 }, // Can be adjusted later
])
