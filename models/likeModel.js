const mongoose = require('mongoose')

const likeSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, 'User ID needed to like.'],
    },
    to: {
      type: mongoose.Schema.ObjectId,
      refPath: 'modelName',
    },
    status: {
      type: String,
      enum: {
        values: ['like', 'unlike', 'dislike', 'undislike'],
        message:
          'Status either like, unlike, dislike or undislike.',
      },
    },
    modelName: {
      type: String,
      enum: ['Restaurant', 'MenuItem'],
      required: [true, 'You need to specify model name!'],
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
likeSchema.index({ from: 1 })
likeSchema.index({ to: 1 })
likeSchema.index({ modelName: 1 })
// Define the model
const Like = mongoose.model('Like', likeSchema)

module.exports = Like
