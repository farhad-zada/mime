const mongoose = require('mongoose')

const menuItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An iteem needs to have a name.'],
    },
    belongs: {
      type: mongoose.Schema.ObjectId,
      required: [
        true,
        'Each menu item must belong to a restaurant!',
      ],
    },
    description: {
      type: String,
      maxLength: [
        1000,
        'A description must be less than equal to 1000 words.',
      ],
      default: undefined,
    },
    readyTime: {
      type: Number,
      default: undefined,
    },
    available: {
      type: Boolean,
      required: [
        true,
        "An item's availablity must be showed explicitly.",
      ],
      default: undefined,
    },
    section: {
      type: String,
      required: [
        true,
        'Each item needs to belong to a section.',
      ],
      default: 'menu',
    },
    period: {
      type: Number,
      min: [
        1,
        'A number needs to be greater than or equal 1.',
      ],
      max: [
        5,
        'A number needs to be less than or equal to 5.',
      ],
      required: [
        true,
        'An item needs to have level explicitly defined.',
      ],
    },
    ingreds: {
      type: Array,
      maxLength: [
        100,
        'No more than 100 ingredients can be added for an item.',
      ],
      default: undefined,
    },
    cuisine: {
      type: Array,
      default: undefined,
    },
    isSection: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: [
        true,
        "A menu item's price needs to be added.",
      ],
      default: undefined,
    },
    allergens: {
      type: Array,
      maxLength: [
        50,
        'Only up to 50 allergen names can be defined for a menu item. If this is' +
          ' a problem for you please contact us using farhad.szd@gmail.com',
      ],
      default: undefined,
    },
    discount: Number,
    discountEnds: Date,
    status: {
      type: String,
      enum: ['active', 'deleted', 'archived'],
      default: 'active',
    },
  },
  {
    toJson: { virtuals: true },
    toObject: { virtuals: true },
  },
)

//check

menuItemSchema.pre(/find/, function (next) {
  this.find({ status: 'active' })
  next()
})

const MenuItem = mongoose.model('Menu', menuItemSchema)

module.exports = MenuItem
