// Models
const User = require('./../models/userModel');
// Packages
const jwt = require('jsonwebtoken');
// utils
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;
  // const cookieOptions = {
  //   expires: process.env.JWT_COOCKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  //   httpOnly: true,
  // };
  // res.cookie('token', token, {
  //   httpOnly: true,
  //   secure: false,
  //   expires: process.env.JWT_COOCKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  //   sameSite: 'Lax',
  // });

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // Check if image uploaded successfully
  if (!req.file) {
    return next(new AppError('failed to upload the image', 400));
  }

  const {
    firstname,
    lastname,
    email,
    password,
    passwordConfirm,
    bio,
    birthdate,
  } = req.body;

  const newUser = await User.create({
    firstname,
    lastname,
    email,
    password,
    passwordConfirm,
    bio,
    birthdate,
    // picture: req.file.path,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check  if data exist
  if (!email || !password) {
    return next(new AppError('Please provide email & password', 400));
  }

  // check if user exist
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkPassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  createSendToken(user, 200, res, req);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization || req.cookies.jwt;
  if (!token || !token.startsWith('Bearer')) {
    return next(new AppError('You have to login first', 401));
  }
  token = token.split(' ')[1];
  // verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({ _id: decoded.id });

  if (!user) {
    return next('This user no longer exist', 401);
  }
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have this permision", 401));
    }
    next();
  };
};

// exports.checkImage = catchAsync(async (req, res, next) => {
//   upload.none();
//   console.log(req.body);
//   next;
// });
