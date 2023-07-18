const mongoose = require('mongoose')
const { default: slugify } = require('slugify')

restauranSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A restaurant needs to have a name.'],
      maxLength: [
        200,
        'Restaurant name must be less than or equal to 200 charachters.',
      ],
      minLength: [1, 'Restaurant name must have at least one charachter.'],
    },
    slug: String,
    reviewsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    dislikesCount: {
      type: Number,
      default: 0,
    },
    visitsCount: {
      type: Number,
      default: 0,
    },
    joinedAt: {
      type: Date,
      default: Date.now()
    },
    serviceStatus: {
      type: String,
      default: 'open',
      enum: {
        values: ['open', 'closed', 'full'],
        message: 'Service status should be one of `open`, `closed`,`full`.',
      },
    },
    weelchairEnterance: {
      type: Boolean,
      default: false,
    },
    paymentMethods: {
      type: [String],
      required: [true, 'A restaurant needs to add payment methods.'],
    },
    profileImage: {
      type: String,
      required: [true, 'A restaurant needs to have profile image'],
    },
    images: [String],
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      formatted_address: String
    },
    //details
    dressCode: [String],
    phones: [String],
    active: {
      type: String,
      default: 'active',
      enum: {
        values: ['active', 'deactive', 'deleted'],
        message: `A restaurant's activity status should be explicitly showed.`,
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

restauranSchema.index({location: '2dsphere'})
restauranSchema.index({name: 1})
restauranSchema.index({serviceStatus: 1})
restauranSchema.index({paymentMethods: 1})
restauranSchema.index({dressCode: 1})
restauranSchema.index({active: 1})

restauranSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {lower: true})
  next()
})
const Restaurant = mongoose.model('Restaurant', restauranSchema)

module.exports = Restaurant
