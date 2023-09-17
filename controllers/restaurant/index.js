const getNears = require('./getNears')
const getMany = require('./getMany')
const getById = require('./getById')
const createOne = require('./createOne')
const deleteOne = require('./deleteOne')
const updateOne = require('./updateOne')
const splitMediaIntoVideoAndImages = require('./splitMediaIntoVideoAndImages')
const uploadProfile = require('./uploadProfile')
const midFindById = require('./midFindById')
const deleteProfile = require('./deleteProfile')
const returnUpdatedRestaurant = require('./returnUpdatedRestaurant')
const processJpegs = require('../../utils/processJpegs')
const processVideos = require('../../utils/processVideos')
const uploadMedia = require('./uploadMedia')
const deleteMedia = require('./deleteMedia')

module.exports = {
  getById,
  getNears,
  getMany,
  deleteOne,
  createOne,
  updateOne,
  splitMediaIntoVideoAndImages,
  uploadProfile,
  midFindById,
  deleteProfile,
  returnUpdatedRestaurant,
  processJpegs,
  uploadMedia,
  processVideos,
  deleteMedia,
}
