const addTable = require('./addTable')
const addManyTables = require('./addManyTables')
const deleteTable = require('./deleteTable')
const getOneTable = require('./getTableById')
const getTables = require('./getTables')
const reserveTable = require('./reserveTable')
const updateTable = require('./updateTable')
const midFindTableById = require('./midFindTableById')

module.exports = {
  addManyTables,
  addTable,
  updateTable,
  getOneTable,
  getTables,
  reserveTable,
  deleteTable,
  midFindTableById,
}
