const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must have owner. {from}'],
    },
    to: {
      type: mongoose.Schema.ObjectId,
      refPath: 'modelName',
      required: [
        true,
        'A review must belong to a restaurant or menu item.',
      ],
    },
    modelName: {
      type: String,
      enum: ['Restaurant', 'Menu'],
      required: [
        true,
        'A review must explicitly show whether it belongs to a restaurant or menu item.',
      ],
    },
    text: {
      type: String,
      maxLength: [
        900,
        'A review should be less than or equal 900 charachters',
      ],
      required: [true, 'A review must have a text.'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be in range of 1 to 5'],
      max: [5, 'Rating must be in range of 1 to 5'],
    },
    ts: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJson: { virtuals: true },
    toObject: { virtuals: true },
  },
)

reviewSchema.index({ from: 1 })
reviewSchema.index({ to: 1 })
reviewSchema.index({ rating: 1 })
reviewSchema.index({ ts: 1 })
reviewSchema.index({ modelName: 1 })

const Review = mongoose.model('Review', reviewSchema)
//TODO: integrate with Restaurant model
module.exports = Review
