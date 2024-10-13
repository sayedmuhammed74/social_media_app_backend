const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Please provide your firstname'],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, 'Please provide your lastname'],
      trim: true,
    },
    slug: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: [true, 'This email is already existed'],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for basic email validation
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: [8, 'password must be at least 8 characters'],
      maxLength: [20, 'password must be at most 20 characters'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (val) {
          // only gonna work on save or create
          return this.password === val;
        },
        message: 'Passwords are not the same',
      },
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    bio: String,
    picture: {
      type: String,
      default:
        'https://res.cloudinary.com/dcltvh825/image/upload/v1727591596/users/szd1rbd4urol2ehagtsc.svg',
    },
    cover: {
      type: String,
      default:
        'https://res.cloudinary.com/dcltvh825/image/upload/v1727788976/users/nmc6eivzyjbucqrgrwn3.jpg',
    },
    birthdate: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Static Methods //
// correct password in login
userSchema.methods.checkPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Middlewares //
// Pre-save middleware to encypt password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 12); // hash cost
  this.passwordConfirm = undefined;
  next();
});

// Pre-save middleware to generate the slug
userSchema.pre('save', function (next) {
  this.slug = slugify(`${this.firstname}-${this.lastname}`, { lower: true });
  next();
});

const User = model('User', userSchema);

module.exports = User;
