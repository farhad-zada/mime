const multerFile = require('./multerFile')
const uploadGS = require('./uploadGS')
const deleteGS = require('./deleteGS')
/**
 * 1. User profile
 * 2. User posts
 * 3. Restaurant profile
 * 4. Restaurant media
 * 5. Menu items
 * 6. Tables
 * 7. Restaurant interiors
 */

module.exports = {
  multerFile,
  uploadGS,
  deleteGS,
}
