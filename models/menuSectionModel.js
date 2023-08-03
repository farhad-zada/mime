// const mongoose = require('mongoose')

// const sectionSchema = mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Menu section must be named!'],
//   },
//   belongs: {
//     type: mongoose.Schema.ObjectId,
//     required: [
//       true,
//       'Each menu section must belong to a restaurant!',
//     ],
//   },
//   isSection: {
//     type: Boolean,
//     default: true,
//   },
//   period: {
//     type: Number,
//     required: [
//       true,
//       'The period of menu section must be showed explicityl.',
//     ],
//   },
//   prev: {
//     type: String,
//     required: [
//       true,
//       'Previous section for each menu section must be showed.',
//     ],
//   },
// })

// const MenuSection = mongoose.model('Menu', sectionSchema)

// module.exports = MenuSection
