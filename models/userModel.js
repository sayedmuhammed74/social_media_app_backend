const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Please tell us your firstname'],
    },
    lastname: {
      type: String,
      required: [true, 'Please tell us your lastname'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a email'],
      unique: [true, 'This email is aready exist'],
      lowercase: true,
      // validate later
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
    picture: { type: String, default: './imgs/users/no-user.svg' },
    birthdate: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    updatedAt: Date,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// encypt password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 12); // hash cost
  this.passwordConfirm = undefined;
  next();
});

// correct password in login
userSchema.methods.checkPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = model('User', userSchema);

module.exports = User;
