const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please, tell us your name.'],
    },
    email: {
      type: String,
      required: [
        true,
        'Please, provide your email address.',
      ],
      unique: true,
      lowercase: true,
      validate: [
        validator.isEmail,
        'Please, provide a valid email.',
      ],
    },
    photo: String,
    role: {
      type: String,
      enum: [
        'user',
        'admin-mime',
        'back-mime',
        'restaurant-owner',
        'waiter',
        'restaurant-admin',
      ],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please, provide a password.'],
      minlength: [
        8,
        'Password minimum length must be 8 charachters.',
      ],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please, confirm your password.'],
      validate: {
        // This only works on CREATE and SAVE!
        validator: function (el) {
          return el === this.password
        },
        message:
          'Confirmation does not match the password.',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    verificationToken: String,
    active: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      required: [
        true,
        'Each user must first be verified by email!',
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next()

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // Delete passwordConfirm field
  this.passwordConfirm = undefined

  next()
})

userSchema.pre('save', function (next) {
  if (!this.isModified || this.isNew || !this.password)
    return next()

  this.passwordChangedAt = Date.now() - 1000
  next()
})

userSchema.pre(/^find/, function (next) {
  // this point to the current query
  this.find({ active: true, verified: true })
  next()
})
userSchema.methods.correctPassword = async function (
  candidatePassword,
  password,
) {
  return await bcrypt.compare(candidatePassword, password)
}
userSchema.methods.changedPasswordAfter = function (
  JWTTimestamp,
) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    )

    // TRUE means CHANGED
    return JWTTimestamp < changedTimestamp
  }
  // False means NOT CHANGED
  return false
}

userSchema.methods.createToken = function (key) {
  const token = crypto.randomBytes(32).toString('hex')

  this.verificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  // After 10 minutes the reset token created the token expires
  console.log(this[key])
  // this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return token
}

const User = mongoose.model('User', userSchema)

module.exports = User
