const AppError = require('./utils/AppError');
const catchAsync = require('./utils/catchAsync');

module.exports = catchAsync(async (req, res, next) => {
  // Make a request to your Express application's endpoint
  await fetch('https://social-media-app-backend-hsgm.onrender.com/keep-alive', {
    method: 'GET',
  });
  res.send('Keep-alive request sent successfully.');
});
